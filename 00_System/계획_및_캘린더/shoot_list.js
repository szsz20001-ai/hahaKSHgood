const shootListData = [
    {
        "id": "0",
        "address": "경기 화성시 봉담읍 동화북길 63 더존 엄재현 더존 더존하우징 주택전시장 www.dujon.co.kr",
        "status": "대기",
        "link": "",
        "note": ""
    },
    {
        "id": "1",
        "address": "당진 대호지면 사성리 525-5 한명희",
        "status": "대기",
        "link": "https://band.us/n/a9a8b2g715rdJ",
        "note": ""
    },
    {
        "id": "2",
        "address": "세종 고운동 1347 임성훈",
        "status": "대기",
        "link": "https://band.us/n/a0afb6ge18P5L",
        "note": ""
    },
    {
        "id": "3",
        "address": "고양 덕양구 지축동 766-60 조준행 최민 중목 특성 높음 / 얼굴등 노출X",
        "status": "대기",
        "link": "https://band.us/n/aaa3b5g9K6fbW",
        "note": ""
    },
    {
        "id": "4",
        "address": "김포시 운양동 1253-3 박현준",
        "status": "대기",
        "link": "https://band.us/n/a5a9b2H3Iav0v",
        "note": ""
    },
    {
        "id": "5",
        "address": "아산 염치읍 송곡리 38-5 김윤기",
        "status": "대기",
        "link": "https://band.us/n/a9a4baI4l5Y10",
        "note": ""
    },
    {
        "id": "6",
        "address": "청주 청원 오창읍 구룡리 379-2 김수연 내부특이 스킵플로우, 스크린 골프완료 후 촬영 / 4월 중순경 입주예정 / 백년손님 가능성",
        "status": "대기",
        "link": "https://band.us/n/aca3bcIdn2C2z",
        "note": ""
    },
    {
        "id": "7",
        "address": "제천 송학 도화리 산21-22 이문규",
        "status": "대기",
        "link": "https://band.us/n/a5adb7I6ucf7F",
        "note": ""
    },
    {
        "id": "8",
        "address": "서울 서초구 방배동 2736-5 이계상 o",
        "status": "대기",
        "link": "https://band.us/n/aeaebaJ7A2O9i",
        "note": ""
    },
    {
        "id": "9",
        "address": "화성 송산동 192-439 김동휘 준공관련으로 클레임&불만 많음",
        "status": "대기",
        "link": "https://band.us/n/a4afb6JfM3V3F",
        "note": ""
    },
    {
        "id": "10",
        "address": "칠곡 왜관 달오3길 16-5 박용우",
        "status": "대기",
        "link": "https://band.us/n/a3afb6k2IaI7C",
        "note": ""
    },
    {
        "id": "11",
        "address": "고성 간성읍 상리 489-5 최영일",
        "status": "대기",
        "link": "https://band.us/n/a4a9baJ3ubq6p",
        "note": ""
    },
    {
        "id": "12",
        "address": "제주 건입동 206-1 일원 정용수",
        "status": "대기",
        "link": "https://band.us/n/a5a0b2k7O0L1G",
        "note": ""
    },
    {
        "id": "13",
        "address": "평택시 죽백동 789 하태우 엔딩동의-입주",
        "status": "대기",
        "link": "https://band.us/n/a9a4bfk1wdg6c",
        "note": ""
    },
    {
        "id": "14",
        "address": "공주 의당면 수촌리 3-33 이진모",
        "status": "대기",
        "link": "https://band.us/n/adafb2kco3ndk",
        "note": ""
    },
    {
        "id": "15",
        "address": "완도 대신리 395 최원",
        "status": "대기",
        "link": "https://band.us/n/a6a3b9l1baJ3j",
        "note": ""
    },
    {
        "id": "16",
        "address": "경주 양남 상라리 338 정인태",
        "status": "대기",
        "link": "https://band.us/n/a0a4balcb9LcB",
        "note": ""
    },
    {
        "id": "17",
        "address": "부여 규암 오수리 560 김정신 네모 중정 / 준공대기중",
        "status": "대기",
        "link": "https://band.us/n/a5a8bcl8L78fK",
        "note": ""
    },
    {
        "id": "18",
        "address": "양주 남방동 521-8 이인수 안형선 010-2392-7733신혜원 010-7736-5187/사용 승인완료 / 외부 조경 4월중~말경 완료,현재 파주 타운하우스거주라 4월말 이후 입주 예정 / 가구 문제",
        "status": "대기",
        "link": "https://band.us/n/a5aebeleM0R5w",
        "note": ""
    },
    {
        "id": "19",
        "address": "화성 새솔동 118-27 박종달 o 하이어 오픈하우스&촬영 완료",
        "status": "대기",
        "link": "https://band.us/n/aba8bemeacJbF",
        "note": ""
    },
    {
        "id": "20",
        "address": "화성 새솔동 71-1 오영민 최장운 추후 리프트 설치 예정, 현관2개",
        "status": "대기",
        "link": "https://band.us/n/a7adb6mbg5zfF",
        "note": ""
    },
    {
        "id": "21",
        "address": "부여 초촌 송정리 311-3 김정신",
        "status": "대기",
        "link": "https://band.us/n/aca1b7mfk9Jah",
        "note": ""
    },
    {
        "id": "22",
        "address": "여주 강찬 이호리 53-2 이종훈",
        "status": "대기",
        "link": "https://band.us/n/acaebcmcbbNdl",
        "note": ""
    },
    {
        "id": "23",
        "address": "항천 용주 죽죽리 192-1,2,3 김동현",
        "status": "대기",
        "link": "https://band.us/n/a7adb9Nd8bmfr",
        "note": ""
    },
    {
        "id": "24",
        "address": "김포 운양동 1312-26 정현태 o 자체 0325 촬영 예정",
        "status": "대기",
        "link": "https://band.us/n/a1a6bcN8bdBbk",
        "note": ""
    },
    {
        "id": "25",
        "address": "김해 내덕동 787-16 김동현",
        "status": "대기",
        "link": "https://band.us/n/a1a9b0O6EcweY",
        "note": ""
    },
    {
        "id": "26",
        "address": "증평 도안 화성리 산47-10 박종훈",
        "status": "대기",
        "link": "https://band.us/n/a8aeb5OdHcv6S",
        "note": ""
    },
    {
        "id": "27",
        "address": "청주 남이 수대리 1-46 최순 착하신분",
        "status": "대기",
        "link": "https://band.us/n/a8a6beO1H53ft",
        "note": ""
    },
    {
        "id": "28",
        "address": "시흥 배곧동 100-9 이승재",
        "status": "대기",
        "link": "https://band.us/n/afa3b4OdJ5f15",
        "note": ""
    },
    {
        "id": "29",
        "address": "성남 분당 판교동 582-9 장지호",
        "status": "대기",
        "link": "https://band.us/n/aea1b5O9r42bK",
        "note": ""
    },
    {
        "id": "30",
        "address": "아산 도고 신언리 478-5 김윤기 엔딩동의",
        "status": "대기",
        "link": "https://band.us/n/aaa7bdOdX1T6l",
        "note": ""
    },
    {
        "id": "31",
        "address": "청주 남이 팔봉리 산22-1 최순",
        "status": "대기",
        "link": "https://band.us/n/a3a9baO7A4Rdg",
        "note": ""
    },
    {
        "id": "32",
        "address": "포천 군내 직두리 704-2 이종철",
        "status": "대기",
        "link": "https://band.us/n/abaeb3Ocb0ffO",
        "note": ""
    },
    {
        "id": "33",
        "address": "김포 운양동 1256-1 채슬기 v 오픈하우스",
        "status": "대기",
        "link": "https://band.us/n/a5a1b5O1F6M26",
        "note": ""
    },
    {
        "id": "34",
        "address": "울주 두동 이전리 207-3 정인태",
        "status": "대기",
        "link": "https://band.us/n/a0a3b7O9G8rbR",
        "note": ""
    },
    {
        "id": "35",
        "address": "안동 임하 신덕리 200 이문규",
        "status": "대기",
        "link": "https://band.us/n/ada9b8Ocj9A7j",
        "note": ""
    },
    {
        "id": "36",
        "address": "전주 덕진 금상동 58 한지형",
        "status": "대기",
        "link": "https://band.us/n/adabb1O2LdzbF",
        "note": ""
    },
    {
        "id": "37",
        "address": "이천 대월 송라리 290-12 이능철",
        "status": "대기",
        "link": "https://band.us/n/aaa4b6Ofo3Far",
        "note": ""
    },
    {
        "id": "38",
        "address": "광주 도척 추곡리 171-1 김성준",
        "status": "대기",
        "link": "https://band.us/n/a7adb3O2o2xaw",
        "note": ""
    },
    {
        "id": "39",
        "address": "강릉 구정 제비리 22-56 최영일",
        "status": "대기",
        "link": "https://band.us/n/a3a6b1O5oficX",
        "note": ""
    },
    {
        "id": "40",
        "address": "부여 규암 오수리 552 김정신 준공전 / 중정 ㅁ자 / 입주완료",
        "status": "대기",
        "link": "https://band.us/n/aaa6b6O8qdP0P",
        "note": ""
    },
    {
        "id": "41",
        "address": "군위 효령 녹등길 154 박용우",
        "status": "대기",
        "link": "https://band.us/n/a6abbfpfO6yaq",
        "note": ""
    },
    {
        "id": "42",
        "address": "항양 유림 천왕봉로 3165-1 강진구",
        "status": "대기",
        "link": "https://band.us/n/a1afbapbQcL3P",
        "note": ""
    },
    {
        "id": "43",
        "address": "원주 문막 동화리 297-6 이재윤",
        "status": "대기",
        "link": "https://band.us/n/aea9bap9Qby4g",
        "note": ""
    },
    {
        "id": "44",
        "address": "안동 풍천 갈전리 546-4 윤희원 입주 2.21 / 조경진행중 / 인터뷰&노출x / 이수빈 과장 지속 체크 및 회신예정",
        "status": "대기",
        "link": "https://band.us/n/a9a7b6p9U0t6u",
        "note": ""
    },
    {
        "id": "45",
        "address": "남해 창선 광천리 287 이찬화",
        "status": "대기",
        "link": "https://band.us/n/aca4b2O8P7d3Y",
        "note": ""
    },
    {
        "id": "46",
        "address": "동해 부곡동 177-8 이태오 강정한",
        "status": "대기",
        "link": "https://band.us/n/a4a3bcpcw11di",
        "note": ""
    },
    {
        "id": "47",
        "address": "동해 부곡동 177-9 김진수 강정한",
        "status": "대기",
        "link": "https://band.us/n/adaab0p4wc26A",
        "note": ""
    },
    {
        "id": "48",
        "address": "수원 장안 조원동 744-1 한명희 o F64 F64, 0403(금)촬영 예정, 드론 주말촬영",
        "status": "대기",
        "link": "https://band.us/n/aaaeb4p125Was",
        "note": ""
    },
    {
        "id": "49",
        "address": "여주 신진동 11-25 이재윤",
        "status": "대기",
        "link": "https://band.us/n/a9a0b0p939T0O",
        "note": ""
    },
    {
        "id": "50",
        "address": "영주 가흥동 281-4 이문규",
        "status": "대기",
        "link": "https://band.us/n/a6a5b3p33bz3Q",
        "note": ""
    },
    {
        "id": "51",
        "address": "인천 중구 운서동 2726-1 이승재",
        "status": "대기",
        "link": "https://band.us/n/a4abb5p494f7O",
        "note": ""
    },
    {
        "id": "52",
        "address": "양양 강현 답리 191-6 최영일",
        "status": "대기",
        "link": "https://band.us/n/acafb8p2s892r",
        "note": ""
    },
    {
        "id": "53",
        "address": "천안 유량동 104-14 이정규 엔딩동의",
        "status": "대기",
        "link": "https://band.us/n/aaa2b8p5scub0",
        "note": ""
    },
    {
        "id": "54",
        "address": "김포 양촌 학운리 243-40,64 정현태 ?",
        "status": "대기",
        "link": "https://band.us/n/a2aeb0p0W3u4A",
        "note": ""
    },
    {
        "id": "55",
        "address": "음성 대소 성본리 334-4 이정규 엔딩동의/넓은단층/연세높아보임/가구불안",
        "status": "대기",
        "link": "https://band.us/n/a7aab8QcB780w",
        "note": ""
    },
    {
        "id": "56",
        "address": "대전 홍도동 6-9 오윤",
        "status": "대기",
        "link": "https://band.us/n/adaab2Qew5C5t",
        "note": ""
    },
    {
        "id": "57",
        "address": "화성 새솔동 69-18 송은수",
        "status": "대기",
        "link": "https://band.us/n/a1a0b1Qe97F8u",
        "note": ""
    },
    {
        "id": "58",
        "address": "광주 곤지암읍 삼리 612-4 이동수",
        "status": "대기",
        "link": "https://band.us/n/aca6b5Q79ehaO",
        "note": ""
    },
    {
        "id": "59",
        "address": "청주 문의면 남계리 469 박종훈",
        "status": "대기",
        "link": "https://band.us/n/acadb8Qe93q4R",
        "note": ""
    },
    {
        "id": "60",
        "address": "안동 일직 조탑리 357-1 안효철",
        "status": "대기",
        "link": "https://band.us/n/a8aebfQ90dUa6",
        "note": ""
    },
    {
        "id": "61",
        "address": "여수 화양 나진리 853-14 강진구",
        "status": "대기",
        "link": "https://band.us/n/a4a4b5raC003D",
        "note": ""
    },
    {
        "id": "62",
        "address": "칠곡 동명 남원리 95-3 이진모",
        "status": "대기",
        "link": "https://band.us/n/aea9b5r3N1xfP",
        "note": ""
    },
    {
        "id": "63",
        "address": "군산 미장동 538-4 한지형",
        "status": "대기",
        "link": "https://band.us/n/a6a5b2r6j070S",
        "note": ""
    },
    {
        "id": "64",
        "address": "인천 연수구 동춘동 559-43,1 김동옥",
        "status": "대기",
        "link": "https://band.us/n/a6a0b1reoaV3F",
        "note": ""
    },
    {
        "id": "65",
        "address": "평택 진위 동천리 11-22,23 하태우 엔딩동의",
        "status": "대기",
        "link": "https://band.us/n/a0afbaS7f8z8p",
        "note": ""
    },
    {
        "id": "66",
        "address": "파주 야당동 73-15 조준행",
        "status": "대기",
        "link": "https://band.us/n/a6a1b4Sbu7udO",
        "note": ""
    },
    {
        "id": "67",
        "address": "당진 시곡동 692-5 강정모 한옥기와 / 중목 / 세라믹과 한식기와 컨셉 / 1층 떡집",
        "status": "대기",
        "link": "https://band.us/n/a7a6b1Sdu0ZaA",
        "note": ""
    },
    {
        "id": "68",
        "address": "제주 서귀포 토평동 2608-1 정용수",
        "status": "대기",
        "link": "https://band.us/n/aba7b7U4K4G6i",
        "note": ""
    },
    {
        "id": "69",
        "address": "화성 봉담 수기리 105-3,11 김용태",
        "status": "대기",
        "link": "https://band.us/n/a7aebbv8q8zdd",
        "note": ""
    },
    {
        "id": "70",
        "address": "화성 봉담 기천리 84-5 김용태",
        "status": "대기",
        "link": "https://band.us/n/a0abb4v5WbB6E",
        "note": ""
    },
    {
        "id": "71",
        "address": "진주 이반성면 대천리 761 정인태",
        "status": "대기",
        "link": "https://band.us/n/a5a9b1XcU4c9Q",
        "note": ""
    },
    {
        "id": "72",
        "address": "거제 하청 연구리 99 정인태",
        "status": "대기",
        "link": "https://band.us/n/aba6b2XeL5mct",
        "note": ""
    },
    {
        "id": "73",
        "address": "안성 공도 마정리 527-2 박창민",
        "status": "대기",
        "link": "https://band.us/n/a5acb6X0Lc1bc",
        "note": ""
    },
    {
        "id": "74",
        "address": "아산 탕정 갈산리 15-59,52 박창민",
        "status": "대기",
        "link": "https://band.us/n/aaafbdXfMdpeE",
        "note": ""
    },
    {
        "id": "75",
        "address": "가평 설악 천안리 410-4 장지훈",
        "status": "대기",
        "link": "https://band.us/n/a9abb3Xcn7Ofb",
        "note": ""
    },
    {
        "id": "76",
        "address": "밀양 삼랑진 행곡리 산252-15 이진모",
        "status": "대기",
        "link": "https://band.us/n/aea7b1YbCeSaz",
        "note": ""
    },
    {
        "id": "77",
        "address": "당진 신평 초대리 588-25 강정모",
        "status": "대기",
        "link": "https://band.us/n/afa4bdY8C2w6J",
        "note": ""
    },
    {
        "id": "78",
        "address": "제주 이도이동 112-6 정용수",
        "status": "대기",
        "link": "https://band.us/n/aea6b5Ye92i1J",
        "note": ""
    },
    {
        "id": "79",
        "address": "충주 대소원 본리 665-11 이종훈",
        "status": "대기",
        "link": "https://band.us/n/a5a4bdYfWdcba",
        "note": ""
    },
    {
        "id": "80",
        "address": "나주 빛가람동 241-1 최원",
        "status": "대기",
        "link": "https://band.us/n/a2a5bbz0H9bfa",
        "note": ""
    },
    {
        "id": "81",
        "address": "청송 안덕 근곡리 308-10,308-17 이문규",
        "status": "대기",
        "link": "https://band.us/n/a1a9bbz6I7FcC",
        "note": ""
    },
    {
        "id": "82",
        "address": "의정부 녹양동 225-2 이인수",
        "status": "대기",
        "link": "https://band.us/n/aaacbcz5Jf10x",
        "note": ""
    },
    {
        "id": "83",
        "address": "아산 음봉 월랑리 69-17 최순",
        "status": "대기",
        "link": "https://band.us/n/aaadb4z2KbTbG",
        "note": ""
    },
    {
        "id": "84",
        "address": "강화 교동 인사리 423,422-1 정현태",
        "status": "대기",
        "link": "https://band.us/n/aaa7b4z4K7307",
        "note": ""
    },
    {
        "id": "85",
        "address": "안동 임하 나천길 22 윤희원",
        "status": "대기",
        "link": "https://band.us/n/a2a3b5z9L38eH",
        "note": ""
    },
    {
        "id": "86",
        "address": "청주 북이 내추리 191-1 김수연",
        "status": "대기",
        "link": "https://band.us/n/a3a4b2z1x6N6F",
        "note": ""
    },
    {
        "id": "87",
        "address": "화성 비봉 쌍학길 50 박종달",
        "status": "대기",
        "link": "https://band.us/n/a9a0b8z1ZfYai",
        "note": ""
    },
    {
        "id": "88",
        "address": "포천 소흘 무림리 473-51 이종철",
        "status": "대기",
        "link": "https://band.us/n/a6a3b71eO9A9x",
        "note": ""
    },
    {
        "id": "89",
        "address": "세종 금남 도남리 205-36 박용우",
        "status": "대기",
        "link": "https://band.us/n/a5a0b010pb80f",
        "note": ""
    },
    {
        "id": "90",
        "address": "옥천 군북 증약리 1426 오윤",
        "status": "대기",
        "link": "https://band.us/n/a6a0bd14v6iaz",
        "note": ""
    },
    {
        "id": "91",
        "address": "여주 금사 전북리 52 이재윤",
        "status": "대기",
        "link": "https://band.us/n/aba3bb164416o",
        "note": ""
    },
    {
        "id": "92",
        "address": "화성 남양 장전리 363,362-1 구본성",
        "status": "대기",
        "link": "https://band.us/n/aba1b7199fmf9",
        "note": ""
    },
    {
        "id": "93",
        "address": "의왕 학의동 100 김윤기",
        "status": "대기",
        "link": "https://band.us/n/aca1b11b04R8l",
        "note": ""
    },
    {
        "id": "94",
        "address": "서울 동대문구 휘경동 319-30,34,35 박상기",
        "status": "대기",
        "link": "https://band.us/n/adadbb15G1D1C",
        "note": ""
    },
    {
        "id": "95",
        "address": "가평 설악 방일리 520-25 장지훈",
        "status": "대기",
        "link": "https://band.us/n/a5a5b52eC95fY",
        "note": ""
    },
    {
        "id": "96",
        "address": "양양 현묵 중광정리 526-1 이승재",
        "status": "대기",
        "link": "https://band.us/n/a6a8b024N3D8v",
        "note": ""
    },
    {
        "id": "97",
        "address": "평택 청북 후사리 154 하태우",
        "status": "대기",
        "link": "https://band.us/n/a0a9b022e6y0M",
        "note": ""
    },
    {
        "id": "98",
        "address": "아산 둔포 신남리 418 최순",
        "status": "대기",
        "link": "https://band.us/n/a6abb221F75fG",
        "note": ""
    },
    {
        "id": "99",
        "address": "성남 수정 창곡동 592-2 오영민",
        "status": "대기",
        "link": "https://www.band.us/band/102053023/post",
        "note": ""
    },
    {
        "id": "100",
        "address": "화송 매송 숙곡리 163 손석현",
        "status": "대기",
        "link": "https://www.band.us/band/102064505/post",
        "note": ""
    },
    {
        "id": "101",
        "address": "예천 호명 산합리 윤희원",
        "status": "대기",
        "link": "https://www.band.us/band/102078052/post",
        "note": ""
    },
    {
        "id": "102",
        "address": "금산 남이 성곡리 853 한지형",
        "status": "대기",
        "link": "https://www.band.us/band/102078156/post",
        "note": ""
    },
    {
        "id": "103",
        "address": "강화 길상 온수리 169-25 김동구",
        "status": "대기",
        "link": "https://www.band.us/band/102065038/post",
        "note": ""
    },
    {
        "id": "104",
        "address": "청주 흥덕 원평동 산2-6 김수연",
        "status": "대기",
        "link": "https://www.band.us/band/102148241/post",
        "note": ""
    },
    {
        "id": "105",
        "address": "세종 고운동 1924 김성운",
        "status": "대기",
        "link": "https://www.band.us/band/102150662/post",
        "note": ""
    },
    {
        "id": "106",
        "address": "괴산 연풍 주진리 583-2 이능철",
        "status": "대기",
        "link": "https://www.band.us/band/102161269/post",
        "note": ""
    },
    {
        "id": "107",
        "address": "예산 덕산 대치리 이정규",
        "status": "대기",
        "link": "https://www.band.us/band/102173736/post",
        "note": ""
    },
    {
        "id": "108",
        "address": "평택 청룡동 34-103 하태우",
        "status": "대기",
        "link": "https://www.band.us/band/102173788/post",
        "note": ""
    },
    {
        "id": "109",
        "address": "이천 부발 마암리 179-12,4 이종훈",
        "status": "대기",
        "link": "https://www.band.us/band/102231303/post",
        "note": ""
    },
    {
        "id": "110",
        "address": "평창 진부 장전리 111-5 이재윤",
        "status": "대기",
        "link": "https://www.band.us/band/102231374/post",
        "note": ""
    },
    {
        "id": "111",
        "address": "김포 운양동 1257-2 채슬기",
        "status": "대기",
        "link": "https://www.band.us/band/102248177/post",
        "note": ""
    },
    {
        "id": "112",
        "address": "군산 마장동 489-2,16 한지형",
        "status": "대기",
        "link": "https://www.band.us/band/102296915/post",
        "note": ""
    },
    {
        "id": "113",
        "address": "영광 백수 지산리 283,288 최원",
        "status": "대기",
        "link": "https://www.band.us/band/102297113/post",
        "note": ""
    },
    {
        "id": "114",
        "address": "가평 상면 행현리 729-9 장지훈",
        "status": "대기",
        "link": "https://www.band.us/band/102297475/post",
        "note": ""
    },
    {
        "id": "115",
        "address": "강화 내가 고천리 419-8,25 정현태",
        "status": "대기",
        "link": "https://www.band.us/band/102310570/post",
        "note": ""
    },
    {
        "id": "116",
        "address": "화성 양감 용소리 508 김동휘",
        "status": "대기",
        "link": "https://www.band.us/band/102322300/post",
        "note": ""
    },
    {
        "id": "117",
        "address": "화성 비봉 삼화리 1863-9 구본성",
        "status": "대기",
        "link": "https://www.band.us/band/102323884/post",
        "note": ""
    },
    {
        "id": "118",
        "address": "보령 주교 관창리 199-3 김정신",
        "status": "대기",
        "link": "https://www.band.us/band/102336274/post",
        "note": ""
    },
    {
        "id": "119",
        "address": "화성 정남 보통리 12-20 한명희",
        "status": "대기",
        "link": "https://www.band.us/band/102337108/post",
        "note": ""
    },
    {
        "id": "120",
        "address": "충북 영동읍 동정리 52-32 장지호",
        "status": "대기",
        "link": "https://www.band.us/band/102337551/post",
        "note": ""
    },
    {
        "id": "121",
        "address": "양평 지평 송현리 산102-1 강성준",
        "status": "대기",
        "link": "https://www.band.us/band/102348046/post",
        "note": ""
    },
    {
        "id": "122",
        "address": "강원 양구읍 상리 597 안효철",
        "status": "대기",
        "link": "https://www.band.us/band/102384423/post",
        "note": ""
    },
    {
        "id": "123",
        "address": "울주 청량 덕하리 415-4 강정한",
        "status": "대기",
        "link": "https://www.band.us/band/102398096/post",
        "note": ""
    },
    {
        "id": "124",
        "address": "대천 유성 계산동 46-1 오윤",
        "status": "대기",
        "link": "https://www.band.us/band/102413205/post",
        "note": ""
    },
    {
        "id": "125",
        "address": "화성 우정 매향리 629-11 박종달",
        "status": "대기",
        "link": "https://www.band.us/band/102414146/post",
        "note": ""
    },
    {
        "id": "126",
        "address": "화성 팔탄 기천리 81-1 김용태",
        "status": "대기",
        "link": "https://www.band.us/band/102415647/post",
        "note": ""
    },
    {
        "id": "127",
        "address": "대구 군위읍 내량리 951-2 이문규",
        "status": "대기",
        "link": "",
        "note": ""
    },
    {
        "id": "128",
        "address": "화성 새솔동 124-7 김용태",
        "status": "대기",
        "link": "",
        "note": ""
    }
];