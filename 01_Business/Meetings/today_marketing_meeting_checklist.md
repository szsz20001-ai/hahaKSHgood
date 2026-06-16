---
tags: [비즈니스/체크리스트, 더존하우징, 마케팅]
date: 2026-06-16
status: 완료
---

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오늘 마케팅 대행사 미팅 핵심 체크리스트 (2026-06-16)</title>
    <!-- Google Fonts: Inter & Noto Sans KR -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: #0f172a;
            --primary-light: #1e293b;
            --accent: #dc2626; /* Red accent for checklist warnings/alerts */
            --accent-bg: #fef2f2;
            --text-dark: #0f172a;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --bg-page: #f8fafc;
            --bg-card: #ffffff;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', 'Noto Sans KR', sans-serif;
            background-color: var(--bg-page);
            color: var(--text-dark);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            padding: 40px 20px;
        }

        .no-print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background-color: #1e293b;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .no-print-btn:hover {
            background-color: #0f172a;
            transform: translateY(-2px);
        }

        .a4-container {
            max-width: 820px;
            margin: 0 auto;
            background-color: var(--bg-card);
            box-shadow: var(--shadow);
            border-radius: 12px;
            border: 1px solid var(--border);
            overflow: hidden;
        }

        .doc-header {
            background-color: var(--primary);
            color: white;
            padding: 40px;
            position: relative;
        }

        .doc-logo {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #94a3b8;
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .doc-title {
            font-size: 24px;
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: 20px;
            word-break: keep-all;
        }

        .doc-meta {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            font-size: 13px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 20px;
            color: #cbd5e1;
        }

        .meta-item strong {
            color: white;
        }

        .doc-body {
            padding: 40px;
        }

        h2 {
            font-size: 17px;
            font-weight: 700;
            color: var(--primary);
            border-left: 5px solid var(--accent);
            padding-left: 12px;
            margin-top: 25px;
            margin-bottom: 15px;
            letter-spacing: -0.5px;
        }

        h2:first-of-type {
            margin-top: 0;
        }

        h3 {
            font-size: 14.5px;
            font-weight: 700;
            color: var(--primary-light);
            margin-top: 15px;
            margin-bottom: 8px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 6px;
        }

        p {
            margin-bottom: 12px;
            font-size: 13px;
            color: #334155;
            text-align: justify;
        }

        ul {
            list-style: none;
            margin-bottom: 15px;
        }

        li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 8px;
            font-size: 13px;
            color: #334155;
        }

        /* Empty square checkbox style for printable lists */
        li::before {
            content: "☐";
            position: absolute;
            left: 4px;
            top: -1px;
            color: var(--accent);
            font-size: 16px;
            font-weight: bold;
        }

        .callout-alert {
            background-color: var(--accent-bg);
            border-left: 4px solid var(--accent);
            padding: 14px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 13px;
        }

        .callout-alert strong {
            color: var(--accent);
        }

        .divider {
            height: 1px;
            background-color: var(--border);
            margin: 30px 0;
        }

        @media print {
            body {
                background-color: white;
                color: black;
                padding: 0;
                font-size: 11pt;
            }

            .no-print-btn {
                display: none;
            }

            .a4-container {
                box-shadow: none;
                border: none;
                max-width: 100%;
                margin: 0;
            }

            .doc-header {
                background-color: #0f172a !important;
                color: white !important;
                padding: 30px !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .doc-body {
                padding: 20px 30px !important;
            }

            h2, h3 {
                page-break-after: avoid;
                break-after: avoid;
            }

            ul, .callout-alert {
                page-break-inside: avoid;
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>

    <button class="no-print-btn" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        체크리스트 인쇄 / PDF 저장
    </button>

    <div class="a4-container">
        
        <!-- Header with Dujon Logo integration -->
        <div class="doc-header">
            <div class="doc-logo" style="display:flex; align-items:center; height:32px;">
                <svg width="149" height="32" viewBox="0 0 149 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M59.0015 15.1655C59.0015 17.5381 58.2693 19.7282 56.8659 21.7358C55.4015 23.7434 53.5711 25.1427 51.3745 25.9336C50.2152 26.3594 48.9949 26.5419 47.7746 26.5419H38.9272V3.78906H47.7135C49.8491 3.78906 51.8626 4.39743 53.6931 5.55332C55.4626 6.70921 56.8659 8.23013 57.8422 10.1769C58.5744 11.8195 59.0015 13.4621 59.0015 15.1655ZM52.8389 15.1655C52.8389 13.5837 52.4118 12.2453 51.4965 11.0286C50.3372 9.44686 48.5678 8.71682 46.2492 8.71682H44.9068V21.6142H46.2492C48.5678 21.6142 50.3372 20.8233 51.4965 19.3024C52.3507 18.0856 52.8389 16.7472 52.8389 15.1655Z" fill="#ffffff"></path>
                    <path d="M81.3333 16.9297C81.3333 18.329 81.2113 19.4849 81.0282 20.4583C80.6621 21.9792 79.8689 23.3176 78.5266 24.5951C76.6961 26.3594 74.1944 27.2111 71.0826 27.2111C67.9098 27.2111 65.4692 26.2986 63.6997 24.5343C62.7845 23.6218 62.1133 22.405 61.7472 21.0058C61.5031 20.0324 61.3811 18.6332 61.3811 16.9906V3.78906H67.2996V16.1389C67.2996 17.1123 67.2996 17.8423 67.3607 18.329C67.4827 19.8499 68.1539 20.945 69.4962 21.5533C70.0454 21.7967 70.5945 21.9183 71.2657 21.9183C72.7301 21.9183 73.8284 21.4316 74.5605 20.3974C75.1097 19.6674 75.3537 18.2073 75.3537 16.078V3.78906H81.2723V16.9297H81.3333Z" fill="#ffffff"></path>
                    <path d="M96.0381 19.5475C96.0381 20.4601 95.9771 21.2509 95.8551 21.7985C95.611 23.076 94.9398 24.1711 93.8415 25.2053C92.3772 26.5437 90.6687 27.1521 88.5942 27.1521C86.1535 27.1521 84.14 26.057 82.6146 23.8061L86.5196 19.8517C86.7027 21.3118 87.3739 22.1027 88.4722 22.1027C89.6315 22.1027 90.1806 21.2509 90.1196 19.4867V3.79087H96.0381V19.5475Z" fill="#C3003B"></path>
                    <path d="M123.739 15.2281C123.739 18.3308 122.702 21.0684 120.628 23.3802C118.248 26.057 115.075 27.3954 111.048 27.3954C107.021 27.3954 103.848 26.057 101.53 23.3802C99.455 21.0684 98.4177 18.3308 98.4177 15.2281C98.4177 13.8289 98.7228 12.3688 99.272 10.8479C99.8211 9.38783 100.553 8.11027 101.53 7.01521C103.909 4.3384 107.082 3 111.109 3C115.136 3 118.309 4.3384 120.689 7.01521C122.702 9.38783 123.739 12.1255 123.739 15.2281ZM117.577 15.2281C117.577 13.6464 117.089 12.2471 116.051 11.0304C114.709 9.50951 113.062 8.77947 111.109 8.77947C109.767 8.77947 108.485 9.14449 107.387 9.93536C106.289 10.7262 105.496 11.6996 105.007 12.9772C104.763 13.7072 104.58 14.4373 104.58 15.1673C104.58 16.6882 105.068 18.0875 106.106 19.3042C107.387 20.8251 109.035 21.5551 111.048 21.5551C113.062 21.5551 114.709 20.8251 115.99 19.3042C117.089 18.2091 117.577 16.8099 117.577 15.2281Z" fill="#C3003B"></path>
                    <path d="M149 26.5437H143.02L132.099 12.5513V26.5437H126.18V3.79087H132.099L143.02 17.7224V3.79087H148.939V26.5437H149Z" fill="#C3003B"></path>
                    <path d="M26.8469 7.91016V22.7543C26.8469 24.9444 25.0165 26.7695 22.8199 26.7695H21.2335C20.2572 28.8987 18.7318 30.7238 16.8403 32.0014H22.8809C28.0062 32.0014 32.1553 27.8645 32.1553 22.7543V7.91016H26.8469Z" fill="#C4003B"></path>
                    <path d="M9.27442 0C4.14908 0 0 4.13688 0 9.24715V9.42966H5.24737V9.24715C5.24737 7.05703 7.01683 5.23194 9.27442 5.23194H24.0403V0H9.27442Z" fill="#C4003B"></path>
                    <path d="M9.94559 11.5589H0V16.7909H9.94559C12.6913 16.7909 14.9489 19.0418 14.9489 21.7795C14.9489 24.5171 12.6913 26.7681 9.94559 26.7681H5.24737V18.8593H0V32H9.94559C15.6201 32 20.1963 27.4373 20.1963 21.7795C20.1963 16.1217 15.5591 11.5589 9.94559 11.5589Z" fill="#ffffff"></path>
                    <path d="M32.1554 0H26.725V5.1711H32.1554V0Z" fill="#ffffff"></path>
                </svg>
                <span style="font-size:14px; font-weight:700; color:#cbd5e1; margin-left:10px; vertical-align:middle; line-height:32px;">PLANNING DEPT</span>
            </div>
            <h1 class="doc-title">오늘 마케팅 대행사 미팅 핵심 체크리스트</h1>
            <div class="doc-meta">
                <div class="meta-item"><strong>회의일시:</strong> 2026년 6월 16일 (화)</div>
                <div class="meta-item"><strong>작성부서:</strong> 기획본부 기획부</div>
                <div class="meta-item"><strong>대상 파트너:</strong> MARKETINGKID (마케팅 대행사)</div>
                <div class="meta-item"><strong>문서 상태:</strong> 완료 및 반영 완료</div>
            </div>
        </div>

        <div class="doc-body">
            
            <p>전일(6/15) 정리한 <em>더존하우징 통합 마케팅 O2O 전략 제안서</em>와 <strong>상반기 마케팅 성과 보고서의 5대 핵심 허점</strong>을 반영하여, 대행사 미팅 시 확인할 핵심 체크리스트입니다.</p>

            <h2>1. ⚠️ 전문가 관점의 5대 누락 데이터 확인 (회의 필수 언급)</h2>
            <div class="callout-alert">
                <strong>주의 사항:</strong> 대행사의 보고서는 "광고비 효율화(CPA 감소, 문의량 증가)"에 집중되어 있으나, 실질적인 비즈니스 성과를 평가하기 위해 반드시 확인해야 할 5가지 누락 데이터와 질문입니다.
            </div>

            <h3>① 최종 매출액 및 ROAS (광고 대비 수익률) 확인</h3>
            <p>계약 건당 평수나 자재에 따라 매출 편차가 큰 단독주택 특성상, '계약 건수'만으로는 마케팅의 실제 이익 기여도를 알 수 없습니다.</p>
            <ul>
                <li><strong>핵심 질문:</strong> "상반기 보고서에 계약 건수와 CPA는 상세하나, 실제 마케팅 유입을 통해 체결된 <strong>수주 매출액(계약 규모)</strong>과 이에 따른 <strong>ROAS(광고비 대비 수익률)</strong> 데이터는 어떻게 집계되고 있습니까?"</li>
            </ul>

            <h3>② 다중 채널 기여도 (Attribution Model) 및 고객 여정 분석</h3>
            <p>각 매체(네이버, 구글, 유튜브 등)의 전환수만 독립적으로 보여줄 뿐, 여러 채널을 거쳐 계약하는 단독주택 고객의 통합 여정 분석이 누락되었습니다.</p>
            <ul>
                <li><strong>핵심 질문:</strong> "고객이 유튜브 인지 → 검색 탐색 → 최종 브랜드 전환으로 이어지는 <strong>'고객 여정(Customer Journey)'</strong> 상에서 각 매체 간의 기여도를 분석한 기여도 모델(Attribution Model) 분석 자료가 있습니까?"</li>
            </ul>

            <h3>③ 전환 고객의 상세 페르소나 사후 분석 (결과 데이터)</h3>
            <p>광고 노출을 위한 타겟팅 계획(은퇴 예정자 등)은 있으나, 실제로 계약을 체결한 진성 고객의 실제 데이터(연령대, 예산, 주요 관심사) 사후 분석이 필요합니다.</p>
            <ul>
                <li><strong>핵심 질문:</strong> "상반기 집행 결과, 실제로 최종 계약까지 이어진 진성 고객들의 <strong>실제 인구통계학적/정성적 데이터(평균 예산, 연령, 단열/디자인 등 주요 관심사)</strong> 분석 결과가 준비되어 있습니까?"</li>
            </ul>

            <h3>④ 홈페이지 이탈률(Bounce Rate) 및 세부 행동 데이터 (CRO)</h3>
            <p>유입 증가량에만 초점을 맞추지 말고, 광고 클릭 후 들어온 유저들이 어떤 페이지에서 이탈하는지 웹사이트 전환율 최적화(CRO)를 위한 행동 분석 데이터가 요구됩니다.</p>
            <ul>
                <li><strong>핵심 질문:</strong> "랜딩 페이지 변경 외에 유저들이 어디서 가장 많이 이탈하는지(Bounce Rate), 체류 시간은 어떠한지 등 <strong>홈페이지 행동 데이터 분석자료</strong>가 있나요? 웹사이트 전환율 최적화(CRO) 계획이 궁금합니다."</li>
            </ul>

            <h3>⑤ 경쟁사 광고비 지출 규모 및 시장 점유율 (SOV)</h3>
            <p>AI 검색 노출 결과만 다루고 있을 뿐, 전체 온라인 전원주택 시장에서 경쟁사(윤성하우징, 한글주택 등) 대비 우리의 온라인 광고 점유율(SOV) 데이터가 필요합니다.</p>
            <ul>
                <li><strong>핵심 질문:</strong> "핵심 키워드 영역에서 경쟁사들의 대략적인 광고비 지출 규모 추정치나 자사의 <strong>시장 점유율(SOV)</strong>을 객관적으로 비교 분석한 자료가 있습니까?"</li>
            </ul>

            <div class="divider"></div>

            <h2>2. 🔍 대행사 실무 점검 및 즉각 요구 사항</h2>
            <ul>
                <li><strong>안동 오픈하우스(아이숲) 모객 부진 대응 일정 확인:</strong> 랜딩 페이지 이원화 및 타겟 조정(퇴직자/친환경 애호가) 전략이 언제 100% 활성화되어 노출되는지 구체적 일정을 받아내야 합니다.</li>
                <li><strong>7~8월 비수기 카카오 푸시 광고 예산 방어 계획 질문:</strong> "카카오 메시지 발송단가(6만원 선)의 주기적 집행에는 동의하나, 비수기인 7-8월 동안의 푸시 광고 예산 비율을 어느 정도로 방어적으로 운용할 계획인가요?"</li>
                <li><strong>홈페이지 SEO 개선 원본 데이터(Raw Data) 즉시 요청:</strong> "지적하신 32개 SEO 개선 가이드라인 원본 데이터를 전달해 주시면, 저희 내부 개발/퍼블리싱 팀과 의논하여 즉각 반영하겠습니다." (특히 <strong>이미지 Alt 속성 99개 누락</strong> 건)</li>
            </ul>

            <div class="divider"></div>

            <h2>3. 💡 신규 확장 타겟 역제안 (대행사 광고 노출 지시)</h2>
            <ul>
                <li><strong>대형견/다견 양육 '펫팸족' 타겟팅 추가:</strong> 마당 있는 집을 극도로 선호하는 반려동물 가정 수요층 집중 공략.</li>
                <li><strong>3040 영앤리치 (도심형/신도시 단독주택) 타겟 추가:</strong> 지예은 숏폼 콘텐츠(인스타그램/유튜브 스폰서드)를 활용해 젊은 고급 건축 수요 발굴.</li>
                <li><strong>캥거루족 / 합가 희망 가족 타겟 추가:</strong> 1·2층 독립형 세대분리 주택 트렌드를 반영한 마케팅 소구점 개발.</li>
            </ul>

            <div class="divider"></div>

            <h2>4. 🎯 하반기 O2O 통합 퍼널 및 역제안 아이디어</h2>
            <ul>
                <li><strong>지예은 숏폼 콘텐츠(본사 접수기) 광고 전면 배치 조율:</strong> 유튜브 본편 런칭 시점 쇼츠 배포 일정 확인.</li>
                <li><strong>본사 자체 박람회(도슨트 투어 예약) & 외부 박람회(미디어 쇼케이스 부스) 마케팅 연계:</strong> 청주 박람회 셋업 상태 체크 연동.</li>
                <li><strong>AI 대화형 검색(네이버 AI 브리핑 등) 대비 전문가 칼럼형 FAQ 랜딩 구축 및 Schema.org 마크업 적용 지시.</strong></li>
                <li><strong>지예은 콜라보 기반 카카오 CRM 마케팅 진행:</strong> 가상 집들이 체험권 배포 등.</li>
            </ul>

        </div>
    </div>

</body>
</html>
