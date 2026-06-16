import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export interface GeminiVerificationResult {
  detected_activity: string;
  assigned_stat: string;   
  score: number;
  reason: string;
}

export async function analyzeSnsActivityTEXT(platform: string, profileHandle: string, cachedMetadata: string): Promise<GeminiVerificationResult> {
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY 환경변수가 등록되지 않았습니다.");
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `사용자가 ${platform} 플랫폼에서 활동한 퍼블릭 데이터를 텍스트로 가져왔어.
계정명: ${profileHandle}
내용 요약: "${cachedMetadata}"

이 내용을 깊이 분석해서, 유저가 주로 어떤 능력을 입증하고 성장시켰는지 파악해.
그리고 이 활동이 유저의 어떤 능력치(STAT)를 입증하는지 스스로 판단해서 영문으로 된 능력치 이름(assigned_stat)을 지어내 줘. (예: "Visual Concept", "Code Mastery", "Daily Consistency" 등)
점수는 내용의 밀도와 꾸준함을 기준으로 1~10점 사이를 부여하고, 다정한 애플 스타일 반말로 격려 메시지(reason)를 작성해.

반드시 다음의 엄격한 JSON 형식으로만 반환해:
{"detected_activity": "어떤 활동인지 한국어로 요약", "assigned_stat": "창조한 능력치 영문명", "score": 숫자, "reason": "반말 격려 메시지"}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 파싱 에러");
    return JSON.parse(jsonMatch[0]) as GeminiVerificationResult;
  } catch (error) {
    console.error("Gemini Text Analysis Error:", error);
    throw new Error("AI 텍스트 분석에 실패했습니다.");
  }
}

export async function generateDailyCoachMessage(activitiesSummary: string, retries = 3, delayMs = 1000): Promise<string> {
  if (!apiKey) return "오늘도 새로운 성장에 집중해볼까요? 파이팅!";
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `당신은 유저의 자기계발을 돕는 따뜻하고 통찰력 있는 AI 코치야.
다음은 유저의 최근 일주일 간 활동 요약이야:
${activitiesSummary || "최근 기록된 활동이 아직 없습니다."}

이 내용을 분석해서 오늘 유저가 어떤 능력치에 집중하면 좋을지, 혹은 얼마나 잘하고 있는지 "한 문장"으로 아주 짧고 다정하게 격려해 줘. 친근한 애플 감성으로 부드러운 반말이나 다정한 어투를 사용해. (예: "지난 주 운동에 몰입한 모습이 멋져! 오늘은 독서로 지식을 채워보는 건 어때?")
결과로 딱 메시지 한 문장만 텍스트로 반환해.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim().replace(/^"/, "").replace(/"$/, "");
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota") || error?.message?.includes("Resource has been exhausted");
    if (isRateLimit && retries > 0) {
      await new Promise(res => setTimeout(res, delayMs));
      return generateDailyCoachMessage(activitiesSummary, retries - 1, delayMs * 2);
    }
    if (isRateLimit) {
      return "현재 분석량이 많아 1분 뒤 자동으로 업데이트됩니다.";
    }
    return "매일 조금씩 발전하는 모습이 훌륭해요! 오늘도 파이팅!";
  }
}

export interface JobRecommendation {
  job1: string;
  reason1: string;
  job2: string;
  reason2: string;
}

export async function recommendJobByStats(stats: Record<string, number>): Promise<JobRecommendation> {
  if (!apiKey) throw new Error("API Key missing");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const statsString = Object.entries(stats).map(([k, v]) => `${k}: ${v}점`).join(", ");
  const prompt = `당신은 사용자의 스탯 데이터를 바탕으로 최적의 커리어를 통찰하는 AI 전문가입니다.
유저의 현재 능력치 스탯 목록이야: [${statsString}]

이 중에서 가장 높은 수치의 스탯 2~3개를 바탕으로, 유저의 잠재력에 가장 잘 어울리는 현실 최고 수준의 직업(또는 커리어 방향성) 2가지를 추천해 줘.
각 직업에 대해 다정한 반말로 왜 이 직업이 잘 맞는지(reason) 1~2문장으로 설명해.

반드시 다음 형식의 JSON으로만 응답해. 다른 텍스트는 덧붙이지 마:
{"job1": "직업명1", "reason1": "이유 설명", "job2": "직업명2", "reason2": "이유 설명"}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 파싱 에러");
    return JSON.parse(jsonMatch[0]) as JobRecommendation;
  } catch (err) {
    return { 
      job1: "분석형 전문가", 
      reason1: "당신의 능력은 다양한 분야를 분석하는 데 탁월해 보입니다.", 
      job2: "자유로운 크리에이터", 
      reason2: "자유로운 창의성이 당신을 새로운 길로 이끌어 줄 거예요." 
    };
  }
}

export async function analyzeTaskForStat(taskName: string): Promise<string> {
  if (!apiKey) return "execution";
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `사용자가 다음 작업을 완료했습니다: "${taskName}"
이 작업이 다음 중 어떤 능력치(stat)를 가장 잘 입증하는지 하나만 선택하세요.
가능한 능력치 목록:
- execution (실행, 과업 완수, 업무 처리)
- mastery (전문성, 기술 숙련도)
- vitality (건강, 운동, 꾸준함, 장기 유지력)
- strategy (전략, 기획, 문제 해결)
- vision (직관, 트렌드, 새로운 시각)
- influence (영향력, SNS, 소통)
- finesse (감각, 디자인, 디테일)
- adaptive (성장, 새로운 기술 습득)
- fortune (행운, 비정형적 성과, 새로운 경험)
- synergy (연결, 협업, 커뮤니티)

분석 결과로 오직 영어 단어 하나(예: execution)만 텍스트로 반환하세요. 마크다운이나 다른 설명은 절대 덧붙이지 마세요.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase().replace(/[^a-z]/g, '');
    
    const validStats = ["execution", "mastery", "vitality", "strategy", "vision", "influence", "finesse", "adaptive", "fortune", "synergy"];
    if (validStats.includes(text)) {
      return text;
    }
    return "execution";
  } catch (error) {
    console.error("Gemini Task Analysis Error:", error);
    return "execution";
  }
}
