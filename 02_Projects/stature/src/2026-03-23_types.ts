export type Stats = Record<string, number>;

/** 온보딩·Firestore `users/{uid}`와 동일한 문자열 */
export type UserAgeRange = "10대" | "20대" | "30대" | "40대" | "50대 이상";
export type UserGender = "남성" | "여성" | "비공개";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  ageRange?: string;
  gender?: string;
  job?: string;
  is_onboarding_complete?: boolean;
  sns_profiles?: Record<string, string>;
  stats: Stats;
  rawScores: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export function isProfileDemographicsComplete(profile: Partial<UserProfile>): boolean {
  return profile.is_onboarding_complete === true;
}

export const STAT_LABELS: Record<keyof Stats, string> = {
  execution: "실행",
  mastery: "전문",
  vitality: "지속",
  strategy: "전략",
  vision: "직관",
  influence: "전달",
  finesse: "감각",
  adaptive: "성장",
  fortune: "행운",
  synergy: "연결",
};

export const STAT_DESCRIPTIONS: Record<keyof Stats, string> = {
  execution: "과업 완수율, 마감 준수, 일일 업무 처리량",
  mastery: "전문 툴 활용 숙련도 및 기술 다양성",
  vitality: "활동 로그, 건강 지표, 장기 활동 유지력",
  strategy: "기획서 구조화 능력, 문제 해결 프로세스",
  vision: "트렌드 반영도, 의사결정 성공 사례",
  influence: "SNS 조회수, 팔로워, 도달 범위",
  finesse: "결과물의 디테일, 디자인 완성도",
  adaptive: "신규 기술 습득 속도, 챌린지 달성률",
  fortune: "기회 포착 능력, 비정형적 성과",
  synergy: "커뮤니티 평판, 팀 협업 기여도",
};

export const STAT_RECOMMENDATIONS: Record<keyof Stats, string> = {
  execution: "오늘의 주요 할 일 3가지를 완수하세요.",
  mastery: "업무와 관련된 새로운 아티클을 1편 읽어보세요.",
  vitality: "30분 이상 가벼운 조깅이나 산책을 해보세요.",
  strategy: "내일의 핵심 목표와 우선순위를 정해보세요.",
  vision: "새로운 산업 트렌드나 뉴스를 스크랩하세요.",
  influence: "SNS에 나만의 인사이트가 담긴 글을 공유해보세요.",
  finesse: "작업물의 디자인이나 디테일을 한 번 더 검수하세요.",
  adaptive: "다뤄보지 않았던 새로운 툴을 하나 시도해보세요.",
  fortune: "평소와 다른 새로운 경로로 이동해보세요.",
  synergy: "동료의 작업물에 진심 어린 칭찬을 남겨보세요.",
};
