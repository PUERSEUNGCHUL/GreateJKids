/** 지정문자 기억공간 (예:우왕,고려32대왕) */
var rememberInfo = {
    "재스야" : ["멍멍","깎깎깎","왈왈","으르르르르르르","월월월","웩 웩" , "네"],
    "우왕" : ["고려32대왕","좌왕"],
    "아하" : ["소과"],
    "오호" : ["대장군"],
	"저녁메뉴 추천" : ["떡볶이","삼겹살","치킨","김치찌개","라면","돈까스","초밥","회","김밥","감자탕","피자","쌀국수","햄버거","편의점 도시락","짜장면","짬뽕","냉면","뼈해장국","일본식덮밥","그냥 굶고 살빼세요","거지가 꿈이야?","닭발","대충 집에있는거 먹기","된장찌개","돼지가 꿈이야?","순대국","찜닭","부대찌개","먹고싶은거","막국수","칼국수","파스타","스테이크","빵"],
    "아" : ["츄","메리카노","이유"],
    "오" : ["마이걸"],
    "췌" : ["장을먹고싶어"]
}


var invaildWordList = [
    "씨발",
    "미친",
    "개같",
    "존나",
    "좆같",
    "개새",
    "새끼",
    "븅신",
    "병신",
    "빙신",
    "ㅅㅂ",
    "시발",
    "ㅁㅣ친",
    "ㅁ1친"

]

/** 아이템정보리스트 */ 
var itemInfoList = []

/** 특성,효과,상태이상 정보 리스트 */
var descriptionList = []

/** 장수정보리스트 */
var memberInfoList = [];

/** 병종정보리스트 */
var memberTypeList = [];

/** 보패리스트 */
var bopaeList = [];

/** */
var placeList = [];

var armyList = [];

var armySkillInfoMap = null;

/** 몽매 트리거 장수 맵 */
var mongMemberInfoList = null;

/** 몽매 리스트 */
var mongList = ["학소","강유","마남풍","장각","동탁","원술","원소","엄백호","손권","하후연","조인","맹획"]

/** 요일배열 */
var weeks = ["일","월","화","수","목","금","토"];

var armKbn = ["방어대","돌격대","기마대","사격대"]
/** 개행문자 */
var crlf = "\n"

/** 최신 릴리즈 일자 */
var releaseDate = null

/*
* @함수명 : 카카오톡 리스폰스 가로채기
* @함수설명 : 카카오톡에서의 알림이 발생했을때 해당 정보를 인수로 받아와서 적.절.한. 처리를 수행한다.  
* @작성자 : 솔왕국, 예린아씨
* @작성일 : 2020/1/29
* @수정자 : 
* @수정일
* @수정이력
* -
*/
function response(room, msg, sender,isGroupChat,replier,ImageDB,packageName,threadId) {
	
	if (msg.indexOf("솔님") != -1 || msg.indexOf("솔왕") != -1) {
		Api.replyRoom("솔왕국",msg)
	}
	
	if (msg.indexOf("않이") != -1 || msg.indexOf("아니~") != -1) {
		replier.reply("남 탓 하지 마세요!")
	}
	
	if (room == "8090대조린이연합" && msg == "/연합전 튜토리얼")
	{
		 replier.reply("https://drive.google.com/file/d/17fglxPoiU_PeKGNtGGyaojZ7drK_A7fu/view?usp=sharing")
    }
    
    if (msg.indexOf("!") == 0) {
        var rt = msg.slice(1).split(" ");
        var rOrder = rt[0];
        var text = rt.slice(1).join(" ");

        var replaceFlg = false;

        if (rOrder.indexOf("!") == 0) {
            rOrder = rOrder.slice(1);
            replaceFlg = true;

        }

        rOrder = room + "@" + rOrder;

        if (text == "") {

            if (replaceFlg) {

                DataBase.removeDataBase(rOrder);
                replier.reply("키워드삭제완료");
                
            } else {

                if (DataBase.getDataBase(rOrder) != null) {
    
                    replier.reply(DataBase.getDataBase(rOrder));
                    
                }
            }

        } else {
            if(rt.length >= 2) {

                if (replaceFlg) {
                    DataBase.setDataBase(rOrder,text);
                    replier.reply("대조연코멘트 변경 완료")
                } else {

                    if (DataBase.getDataBase(rOrder) != null) {
                        DataBase.appendDataBase(rOrder,crlf);
                    }
                    DataBase.appendDataBase(rOrder,text);
                    replier.reply("대조연 코멘트 추가 완료")
                }
            }
        }
    }
	
	

    //카카오톡 메시지가 '/'로 시작되어있지 않은 경우 지정문자 기억공간에서 답변을 검색한다.

    if (msg.indexOf("/") != 0) {

        if (rememberInfo[msg] != null) {

            //대조연봇 반항(1퍼센트 확률 뚫으신분)
            if (Math.random() * 10 > 9.9) {

                replier.reply(msg + " 싫어요 안해요 일하세요.");

            } else {

                replier.reply(rememberInfo[msg][Math.floor(Math.random() * rememberInfo[msg].length)]);
            }
        }

        for (var i = 0 ; i < invaildWordList.length; i++) {
            if (msg.replace(/ /gi,"").indexOf(invaildWordList[i]) > -1) {
    
                replier.reply("대조연은 착하고 이쁘게 바른말만 써요. 다 봤음");
    
            }
        }

        return;
    }



    var currentDate = new Date();

    // 장수정보 초기화
    if (memberInfoList.length == 0) {

        memberInfoList = configMemberInfoList();

    }

    // 병종정보 초기화
    if (memberTypeList.length == 0) {

        memberTypeList = configMemberTypeList();
    }

    //설명정보 초기화
    if (descriptionList.length == 0) {

        descriptionList = configDescription();
    }

    //보패정보 초기화
    if (bopaeList == null || bopaeList.length == 0) {

        bopaeList = configBopaeList();
    }

    //아이템 정보 초기화
    if (itemInfoList == null || itemInfoList.length == 0) {

        itemInfoList = configItemList();

    }

    //몽매트리거장수맵 초기화
    if (mongMemberInfoList == null) {

        mongMemberInfoList = getMongMemberInfoMap();
    }

    if (placeList == null || placeList.length == 0) {

        placeList = getPlaceList();
    }

    if (armyList == null || armyList.length == 0) {
        armyList = getArmyList();

        armySkillInfoMap = getArmySkillInfoMap();
    }

    var tempData = msg.slice(1).split(" ");

    //명령어
    var order = tempData[0];

    //옵션
    var parameter = tempData.slice(1);

    //명령어가 존재하지 않는경우 (/만 입력되거나 /이후에 바로 띄어쓰기가 입력된 경우)

    if (order == "") return;


    var rtnText = ""
	
	

    //0. 대조연 정보
    if (room == "8090대조린이연합" && order == "대조연") {
        rtnText = "함께 웃으면서 팁 공유하고 모두가 주인인 \"8090대조린이연합\"을 함께 키워갑시다." + crlf
        rtnText = rtnText + crlf
        rtnText = rtnText + "운영진" + crlf
        rtnText = rtnText + " 사령관 - 솔왕국" + crlf
        rtnText = rtnText + " 참모 - 예린아씨, trivial" + crlf
        rtnText = rtnText + " 장군 - 곽철룡, 연냥" + crlf
        rtnText = rtnText + crlf
        rtnText = rtnText + "카톡방 2개 운영(수다방, 공지방) - 2개 중 1개 참여 필수" + crlf
        rtnText = rtnText + " 수다방(참여코드 4522) - 자유로운 주제 + 연합공지" + crlf
        rtnText = rtnText + " https://open.kakao.com/o/gR1XTC5" + crlf
        rtnText = rtnText + " 공지방(참여코드 0331) - only 연합공지" + crlf
        rtnText = rtnText + " https://open.kakao.com/o/gtpScKVb" + crlf
        rtnText = rtnText + crlf
        rtnText = rtnText + "주간 사신의 분노 35이상" + crlf
        rtnText = rtnText + " 주간 사신 토벌 7회 이상을 의미" + crlf
        rtnText = rtnText + "  각성 사신 화(백호 중급), 토(청룡 최상급) 밤 9시 소환" + crlf
        rtnText = rtnText + "  ※연합원의 요청에 따라 조절 가능" + crlf
        rtnText = rtnText + crlf
        rtnText = rtnText + "수, 토 밤 11시 연합전 참여 - \"개발자연합\", \"현천맹\"과 동맹" + crlf
        rtnText = rtnText + " 적극적인 참여 권장" + crlf
        rtnText = rtnText + " 디스코드(음성채팅) 활용" + crlf
        rtnText = rtnText + " https://discord.gg/xZ4q2jf" + crlf
        rtnText = rtnText + crlf
        rtnText = rtnText + "대조연봇 활용" + crlf
        rtnText = rtnText + " 카톡방에 \"/대조연봇\" 입력시 사용방법 소개" + crlf
        rtnText = rtnText + crlf
        rtnText = rtnText + "부캐연합" + crlf
        rtnText = rtnText + " 조금쎈언니들" + crlf
        rtnText = rtnText + crlf
        rtnText = rtnText + "연합 활동 주의사항" + crlf
        rtnText = rtnText + " 카톡방(수다방)의 클린한 대화를 위해 정치, 욕설, 19금 등 분란 유발 발언은 금지" + crlf
        rtnText = rtnText + " 공카 및 디씨 활동시 다른 유저와의 분란 주의" + crlf
        rtnText = rtnText + " 일신상의 이유로 장기 미접속 사유 발생시 운영진 개인톡" + crlf
        rtnText = rtnText + crlf
        rtnText = rtnText + "즐기면서 하는 사람이 일류다! 스트레스 받지 않고 함께 즐깁시다."

        replier.reply(rtnText);

    }

    //1. 대조연봇

    /*
    * 대조연봇
    * /[아이템명] : 보물정보를 출력한다.(예: /백학선)
    * /[장수명] : 장수정보를 출력한다.(예: /제갈량)
    * /[전장명] : 전장 정보를 출력한다. (예: /초원)
    * /몽매 [몽매장수명][1,2] : 몽매정보를 출력한다. (예: /몽매 조인 1 -> 현군의 조인, /몽매 조인 2 -> 번성의 조인)
    * /연합전 [병종명] : 연합전 병종정보를 출력한다. (예: /연합전 보급대)
    * /연합 [연합명] : 연합전 기록을 출력한다. (예: /연합 8090대조린이연합)
    * /연합 [연합명] [연합명] : 연합전 상대전적을 출력한다.(예: /연합전적 8090대조린이연합 질주)
    * /코스트 [장수명] ... : 연이어 전달된 장수의 코스트를 계산하여 출력한다.(예: /코스트 영정 아만 여포 항적 조운)
    */
    if (order == "대조연봇") {
        
        rtnText = "* 대조연봇 사용설명서*" + crlf

        rtnText = rtnText + "/[아이템명]" + crlf
        rtnText = rtnText + "/[장수명]" + crlf
        rtnText = rtnText + " -- 검색옵션 : 몽매" + crlf
        rtnText = rtnText + "/[병종명]" + crlf
        rtnText = rtnText + " -- 검색옵션 : 장수" + crlf
        rtnText = rtnText + "/[효과]" + crlf
        rtnText = rtnText + " -- 검색옵션 : 장수,보물" + crlf
        rtnText = rtnText + "/상태이상" + crlf
        rtnText = rtnText + " -- 상태이상 전체 출력" + crlf
        rtnText = rtnText + "/연합전" + crlf
        rtnText = rtnText + " -- 연합전 출석표 관리" + crlf
        rtnText = rtnText + "/코스트장수 [코스트]" + crlf
        //rtnText = rtnText + "/[전장명]" + crlf
        //rtnText = rtnText + " - 전장 정보를 출력한다. (예: /초원)" + crlf
        rtnText = rtnText + "/몽매 [몽매장수명]" + crlf
        //rtnText = rtnText + " -- 예2: /몽매 조인 2 -> 번성의 조인" + crlf
        //rtnText = rtnText + "/연합전 [병종명]" + crlf
        //rtnText = rtnText + " - 연합전 병종정보를 출력한다." + crlf
        //rtnText = rtnText + " - (예: /연합전 보급대)" + crlf
        rtnText = rtnText + "/코스트 [장수명] ... " + crlf
        rtnText = rtnText + " -- (예: /코스트 영정 아만 여포 항적 조운)" + crlf
        rtnText = rtnText + "/내장수" + crlf
        rtnText = rtnText + " - 본인의 장수정보를 관리한다." + crlf
        rtnText = rtnText + "/남의장수 [닉네임]" + crlf
        rtnText = rtnText + " - 남의 장수를 염탐한다." + crlf
        rtnText = rtnText + "대조연 코멘트" + crlf
        rtnText = rtnText + " - 특정단어에 대한 코멘트를 관리한다." + crlf
        rtnText = rtnText + " -- ![키워드]:키워드 출력" + crlf
        rtnText = rtnText + " -- ![키워드] [코멘트]:키워드에 코멘트 추가" + crlf
        rtnText = rtnText + " -- !![키워드]:키워드 삭제" + crlf
        rtnText = rtnText + " -- !![키워드] [코멘트]:키워드 변경"
        
        replier.reply(rtnText)
        //console.log(rtnText);
    }


    //2.아이템 정보 검색

    /*
    * 백학선 ★7
    * 종류 : "무기"(부채)
    * 능력 : 정신력(95), 사기(10)
    * 효과 : 연속 책략 - 공격 책략 사용 시 연속으로 책략을 사용한다.
    * 대조연 코멘트
    * -만월쟝 ...
    */
    for (var i = 0 ; i < itemInfoList.length ; i++) {

        if (order.replace(" ","") == itemInfoList[i].이름.replace(" ","")) {

            var itemInfo = itemInfoList[i]

            rtnText = rtnText + " * " + itemInfo.이름 + " ★" + itemInfo.등급 + crlf
            rtnText = rtnText + "   종류 : " + itemInfo.종류 + (itemInfo.category == "보조구" ? "" : "("+itemInfo.종류2+")") + crlf
            rtnText = rtnText + "   능력 :" + (itemInfo.공격력 == 0 ? "" : " 공격력 : " + itemInfo.공격력) + (itemInfo.정신력 == 0 ? "" : " 정신력 : " + itemInfo.정신력) + (itemInfo.방어력 == 0 ? "" : " 방어력 : " + itemInfo.방어력) + (itemInfo.순발력 == 0 ? "" : " 순발력 : " + itemInfo.순발력) + (itemInfo.사기 == 0 ? "" : " 사기 : " + itemInfo.사기) + (itemInfo.이동력 == 0 ? "" : " 이동력 : " + itemInfo.이동력) + crlf
            rtnText = rtnText + "   효과 : " + itemInfo.특수효과 + (itemInfo.특수효과수치 == "-" ? "" : "("+itemInfo.특수효과수치+")") + crlf

            for (var j = 0 ; j < descriptionList.length ; j++) {

                if (descriptionList[j].장수특성 == itemInfo.특수효과) {
                    rtnText = rtnText + "          " + descriptionList[j].설명 + crlf
                    j = descriptionList.length + 1
                }
            }

            

            if (itemInfo.특수효과2 != "") {
                rtnText = rtnText + "   효과2 : " + itemInfo.특수효과2 + (itemInfo.특수효과2수치 == "-" ? "" : "("+itemInfo.특수효과2수치+")") + crlf

                for (var j = 0 ; j < descriptionList.length ; j++) {

                    if (descriptionList[j].장수특성 == itemInfo.특수효과2) {
                        rtnText = rtnText + "          " + descriptionList[j].설명 + crlf
                        j = descriptionList.length + 1
                    }
                }

            }

            rtnText = rtnText + "   " + itemInfo.보물설명

            if (DataBase.getDataBase(room+ "@" + itemInfo.이름.replace(/ /gi, "")) != null) {
                rtnText = rtnText + crlf + "☆대조연코멘트" + crlf
                rtnText = rtnText + DataBase.getDataBase(room+ "@" + itemInfo.이름.replace(/ /gi, ""));
                
            }
            
            replier.reply(rtnText);
        }
    }




    //3.장수정보 검색

    /*

    * 변월향(군악대)
    * 코스트 : 16
    * 능력치 : 무력(43), 지력(88), 통솔력(69), 순발력(97), 행운(82)
    * 30레벨특성 : 물리 피해 감소(10)
    * 50레벨특성 : 험로 이동
    * 70레벨특성 : 범위 책략 피해 감소(70)
    * 90레벨특성 : 주위 강행
    * 태수효과 : 견직 특화
    * 군주효과 : 전 징세 보조
    * 대조연 코멘트
    * - 아이야이야 
    */
    for (var i = 0 ; i < memberInfoList.length ; i++) {

        if (memberInfoList[i].이름 == order || memberInfoList[i].별칭 == order) {

            var m = memberInfoList[i]
    
    
            rtnText = ""
    
            rtnText = m.이름 + "(" + m.병종 + ") " + (m.별칭 == ""? "" : "aka "+m.별칭) + " - " + m.계보 +crlf
            rtnText = rtnText + "  코스트 : " + (m.코스트 + 10) +crlf
            rtnText = rtnText + "  능력치(무지통민행) : "
            rtnText = rtnText + m.무력+", "+m.지력+", "+m.통솔력+", "+m.순발력+", "+m.행운+crlf
            rtnText = rtnText + "  30레벨특성 : " + m.특성30+crlf   
            rtnText = rtnText + "  50레벨특성 : " + m.특성50+crlf
            rtnText = rtnText + "  70레벨특성 : " + m.특성70+crlf
            rtnText = rtnText + "  90레벨특성 : " + m.특성90+crlf
            rtnText = rtnText + "  태수효과 : " + m.태수효과+crlf
            rtnText = rtnText + "  군주효과 : " + m.군주효과+crlf
            
            rtnText = rtnText + "  추천병참 : " + m.추천병종+"("+m.추천병종순+"위)"
            
            if (parameter[0] == "몽매") {

                var existFlg = false

                rtnText = rtnText + crlf + crlf + "  몽매 트리거"
                
                for (var j = 0 ; j < mongList.length ; j++) {

                    for (var k = 0 ; k < mongMemberInfoList[mongList[j]].length ; k++) {
                        
                        
                        if ((m.별칭 == "" && mongMemberInfoList[mongList[j]][k] == m.이름) || (m.별칭 != "" && mongMemberInfoList[mongList[j]][k] == m.별칭)) {

                            existFlg = true
                            rtnText = rtnText + crlf + "   " + mongList[j];

                        }
                    }

                }
                
                if (!existFlg) {

                    rtnText = rtnText + crlf + "   얘는 몽매트리거 아님요";
                }
            }

            if (DataBase.getDataBase(room+ "@" + (m.별칭 == "" ? m.이름 : m.별칭).replace(/ /gi, "")) != null) {
                rtnText = rtnText + crlf + "☆대조연코멘트" + crlf
                rtnText = rtnText + DataBase.getDataBase(room+ "@" + (m.별칭 == "" ? m.이름 : m.별칭).replace(/ /gi, ""));
                
            }

            replier.reply(rtnText)
        }
        
    }

    //4.병종 정보 검색
    /*
    * 검사 (공정방순사) : ASCSA
    * 이동거리 : 6
    *
    * 부대효과1 : 공격 명중률 증가(7%)
    * 부대효과2 : 공격력 보조(9%)
    * 부대효과3 : 책략명중률 증가(10%)
    * 01레벨특성 : HP보조
    * 10레벨특성 : HP보조
    * 15레벨특성 : HP보조
    * 20레벨특성 : 
    * 25레벨특성 : 
    */
    for (var i = 0 ; i < memberTypeList.length ; i++) {

        if (order == memberTypeList[i].병종) {
            
            var m = memberTypeList[i];

            rtnText = m.병종 + " (무력,지력,통솔력,순발력,행운) : "+ m.공격력 +m.정신력 +m.방어력 +m.순발력 +m.사기 + crlf
            rtnText = rtnText + " 이동거리 : " + m.이동 + crlf
            rtnText = rtnText + " 무기 : " + m.무기 + crlf
            rtnText = rtnText + " 방어구 : " + m.방어 + crlf
            rtnText = rtnText + crlf
            rtnText = rtnText + " 부대효과1 : "+m.효과1+"("+m.효과상세1+")" + crlf
            rtnText = rtnText + " 부대효과2 : "+m.효과2+"("+m.효과상세2+")" + crlf
            rtnText = rtnText + " 부대효과3 : "+m.효과3+"("+m.효과상세3+")" + crlf
            rtnText = rtnText + " 01레벨특성 : "+m.특성1 + crlf
            rtnText = rtnText + " 10레벨특성 : "+m.특성10 + crlf
            rtnText = rtnText + " 15레벨특성 : "+m.특성15 + crlf
            rtnText = rtnText + " 20레벨특성 : "+m.특성20 + crlf
            rtnText = rtnText + " 25레벨특성 : "+m.특성25

            if (DataBase.getDataBase(room+ "@" + m.병종.replace(/ /gi, "")) != null) {
                rtnText = rtnText + crlf + "☆대조연코멘트" + crlf
                rtnText = rtnText + DataBase.getDataBase(room+ "@" + m.병종.replace(/ /gi, ""));
                
            }

            if (parameter[0] == "장수") {

                var cnt = 0;
                rtnText = rtnText + crlf + crlf + " #장수 검색 결과 @@명#" + crlf

                for (var j = 0 ; j < memberInfoList.length ; j++) {

                    if (memberInfoList[j].병종 == order) {

                        var m = memberInfoList[j]
                        cnt ++;
        
                        rtnText = rtnText + " " + m.이름 + " " + (m.코스트+10)+crlf
                    }

                }

                rtnText = rtnText.replace("@@",cnt);

            }

            replier.reply(rtnText);
        }

    }

    //5.보패검색
    /*
    * 파동의무구(청룡 4성)
    *  필요보패 : 각 항 심 미
    *  -물리 공격에 성공하면 공격자의 반대 방향으로 1칸 밀어낸다.
    *   밀어낼 수 없는 경우와 연속 공격의 첫 공격은 최대 HP의 5%만큼 추가 피해가 발생한다.
    *   단, 추가 피해는 공격자 공격력의 10%를 초과할 수 없다.
    */
    if (order == "보패") {

        if (parameter.length > 0) {

            rtnText = ""

            if (parameter[0] == "청룡" || parameter[0] == "주작" || parameter[0] == "백호") {
                
                rtnText = parameter[0] + "보패조합 검색 결과" + crlf 

                for (var i = 0; i < bopaeList.length ; i++) {

                    if (bopaeList[i].category == parameter[0]) {
                        
                        rtnText = rtnText + "  " + bopaeList[i].name + "(" + bopaeList[i].level + "성) " +  bopaeList[i].bp1 + bopaeList[i].bp2 + bopaeList[i].bp3 + bopaeList[i].bp4 + crlf
                        
                        
                    }
                    
                }

                replier.reply(rtnText);

            } else {

                for (var i = 0; i < bopaeList.length ; i++) {

                    if (bopaeList[i].name == parameter[0]) {

                        rtnText = bopaeList[i].name + "(" + bopaeList[i].category + bopaeList[i].level +"성)" + crlf;
                        rtnText = rtnText + " 필요보패 : " + bopaeList[i].bp1 + bopaeList[i].bp2 + bopaeList[i].bp3 + bopaeList[i].bp4 + crlf
                        rtnText = rtnText + " - " + bopaeList[i].desc

                        replier.reply(rtnText);

                    }
                }
            }
        }
    }

    //6.장수 상세검색 (#1.코스트)
    if (order == "장수코스트") {
        
        if (parameter.length == 0 || isNaN(parameter[0])) {
            replier.reply("/장수코스트 16 등으로 입력해.")
        } else {

            rtnText = parameter[0] + "코스트 장수 검색 결과" + crlf
    
            for (var i = 0 ; i < memberInfoList.length ; i++) {
    
                if (memberInfoList[i].코스트+10 == parameter[0]) {

                    var m = memberInfoList[i]
    
                    rtnText = rtnText + " " + m.이름+"("+m.병종+")"+crlf
                }
            }
    
            replier.reply(rtnText);
        }
    }

    //7. 설명정보 검색
    for (var i = 0 ; i < descriptionList.length ; i++) {

        if (order == descriptionList[i].장수특성 || order == descriptionList[i].장수특성.replace("상태:","")) {

            rtnText = descriptionList[i].장수특성 + crlf
            rtnText = rtnText +" " + descriptionList[i].설명 
            
            if (parameter[0] == "장수") {

                var cnt = 0;
                rtnText = rtnText + crlf + " #장수 검색 결과 @@명#" + crlf

                for (var j = 0 ; j < memberInfoList.length ; j++) {

                    if (memberInfoList[j].특성30.replace(/ /gi,"") == order
                        || memberInfoList[j].특성50.replace(/ /gi,"") == order
                        || memberInfoList[j].특성70.replace(/ /gi,"") == order
                        ||memberInfoList[j].특성90.replace(/ /gi,"") == order) {

                        var m = memberInfoList[j]
                        cnt ++;
        
                        rtnText = rtnText + " " + m.이름+"("+m.병종+") " + (m.코스트+10)+crlf
                    }

                }

                rtnText = rtnText.replace("@@",cnt);

            }

            if (parameter[0] == "보물") {

                var cnt = 0;
                rtnText = rtnText + crlf + " #보물 검색 결과 @@개#" + crlf

                for (var j = 0 ; j < itemInfoList.length ; j++) {

                    if (itemInfoList[j].특수효과.replace(/ /gi,"") == order
                        || itemInfoList[j].특수효과2.replace(/ /gi,"") == order) {

                        var item = itemInfoList[j]
                        cnt ++;
        
                        rtnText = rtnText + " " + item.이름+"("+item.종류+") "+crlf
                    }

                }

                rtnText = rtnText.replace("@@",cnt);
            }

            replier.reply(rtnText)
        }

    }



    //8.전장 정보 검색
    /*
    * 초원
    * 추천병종 : 군주, 산악기병, 궁기병, 경기병, 책사, 노병
    * 대조연 추천덱
    * - 조운 황충 순욱 장료 변월향
    */

    //9.지형 정보 검색

    //10.몽매 정보 검색
    /*
    * 학소 (진창의 학소)
    * 필수장수 : 착갈량, 강유, 위연, 비의, 왕평, 마대
    * 추천장수 : 항적, 곽가, 사마의, 진태
    * 대조연 코멘트
    * - 이렇게 이렇게 때리고 팍팍 때려서 딜을 넣자
    */
    if (order == "몽매") {

        if (parameter.length == 0) {

            

            rtnText = "몽매 정보" + crlf;
            for (var i = 0 ; i < mongList.length ; i++) {

                rtnText = rtnText + " "+(i+1)+"월몽매 : " + mongList[i] + (new Date().getMonth() == i ? "<-지금":"") + crlf

            }

            replier.reply(rtnText);

        } else {

            if (mongMemberInfoList[parameter[0]] != null) {

                rtnText = parameter[0]+" 몽매 트리거 장수" + crlf
                
                for (var i = 0 ; i < mongMemberInfoList[parameter[0]].length ; i++) {
                    
                    if (mongMemberInfoList[parameter[0]][i] != "") {
                        rtnText = rtnText + " "+mongMemberInfoList[parameter[0]][i] + crlf;
                    }
                    

                }

                replier.reply(rtnText);

            }
        }
    }

    //11.연합전 병종 정보 검색
    /*
    * 보급대
    * 추천병참관리 : 방어력 = 사기 > 정신력 > 공격력 > 순발력
    * 레벨1 스킬 : 소보급, 각성, 진화
    * 레벨5 스킬 : 초열, 혼란, 포박, 소보급, 각성, 진화
    * 대조연 코멘트
    * - 때려서 렙업하고 힐함요
    */

    
    //12.코스트 계산
    /*
    * 코스트 계산 결과 : 49
    * 조운 24
    * 항적 25
    */
    if (order == "코스트" || order == "코") {
        rtnText = "코스트 계산결과 : @@@"
        var totalCost = 0;
        

        for (var i = 0 ; i < parameter.length ; i++) {

            if (parameter[i] == "80우희") {

                rtnText = rtnText + crlf;
                rtnText = rtnText + " 80우희 : 12";
                totalCost += 12
            } else {
                for (var j = 0 ; j < memberInfoList.length ; j++) {
    
                    if ((memberInfoList[j].별칭 == "" && memberInfoList[j].이름 == parameter[i]) || 
                        (memberInfoList[j].별칭 != "" && memberInfoList[j].별칭 == parameter[i])) {
    
                        memberInfo = memberInfoList[j];
    
                        if (i != parameter.length) {
                            rtnText = rtnText + crlf;
                            rtnText = rtnText + " " + (memberInfo.별칭 == "" ? memberInfo.이름 : memberInfo.이름+"("+memberInfo.별칭+")") + " : " + (memberInfo.코스트 + 10);
                            totalCost += (memberInfo.코스트 + 10)
                        }
                    }
                }
            }
        
        }
        replier.reply(rtnText.replace("@@@",totalCost));
    }

    //13.모의합성
    /*
    * 월요일(무기 50%) 합성결과
    * 
    * * 백학선 ★7
    *   종류 : "무기"(부채)
    *   능력 : 정신력(95), 사기(10)
    *   효과 : 연속 책략
    */
    
    if (order == "합성") {
        
        var wk = new Date().getDay();
        var bonus = ""

        if (wk == 0 || wk == 2 || wk == 5) {
            bonus = "무기";
        } else if(wk == 1 || wk == 4) {
            bonus = "방어구"
        } else if (wk == 3 || wk == 6) {
            bonus = "보조구"
        }

        var bonusRand = Math.floor(Math.random() * 2)

        var tempList = []
        var itemInfo = {}

        for (var i = 0 ; i < itemInfoList.length ; i++) {

            if (bonusRand == 1 && itemInfoList[i].종류 == bonus && itemInfoList[i].등급 == "7") {
                tempList.push(itemInfoList[i]);
            }

            if (bonusRand == 0 && itemInfoList[i].종류 != bonus && itemInfoList[i].등급 == "7") {
                tempList.push(itemInfoList[i]);
            }

        }

        itemInfo = tempList[Math.floor(Math.random() * tempList.length)]
        rtnText = weeks[wk] + "요일 (" + bonus + " 50%) 합성 결과" + crlf
        rtnText = rtnText + " * " + itemInfo.이름 + " ★" + itemInfo.등급 + crlf
        rtnText = rtnText + "   종류 : " + itemInfo.종류 + (itemInfo.category == "보조구" ? "" : "("+itemInfo.종류2+")") + crlf
        rtnText = rtnText + "   능력 :" + (itemInfo.공격력 == 0 ? "" : " 공격력 : " + itemInfo.공격력) + (itemInfo.정신력 == 0 ? "" : " 정신력 : " + itemInfo.정신력) + (itemInfo.방어력 == 0 ? "" : " 방어력 : " + itemInfo.방어력) + (itemInfo.순발력 == 0 ? "" : " 순발력 : " + itemInfo.순발력) + (itemInfo.사기 == 0 ? "" : " 사기 : " + itemInfo.사기) + (itemInfo.이동력 == 0 ? "" : " 이동력 : " + itemInfo.이동력) + crlf
        rtnText = rtnText + "   효과 : " + itemInfo.특수효과 + (itemInfo.특수효과수치 == "-" ? "" : "("+itemInfo.특수효과수치+")") +crlf

        for (var j = 0 ; j < descriptionList.length ; j++) {

            if (descriptionList[j].장수특성 == itemInfo.특수효과) {
                rtnText = rtnText + "          " + descriptionList[j].설명 + crlf
                j = descriptionList.length + 1
            }
        }

        if (itemInfo.특수효과2 != "") {
            rtnText = rtnText + crlf + "   효과2 : " + itemInfo.특수효과2 + (itemInfo.특수효과2수치 == "-" ? "" : "("+itemInfo.특수효과2수치+")")

            for (var j = 0 ; j < descriptionList.length ; j++) {

                if (descriptionList[j].장수특성 == itemInfo.특수효과2) {
                    rtnText = rtnText + "          " + descriptionList[j].설명 + crlf
                    j = descriptionList.length + 1
                }
            }

        }

        if (DataBase.getDataBase(room+ "@" + itemInfo.이름.replace(/ /gi, "")) != null) {
            rtnText = rtnText + crlf + "☆대조연코멘트" + crlf
            rtnText = rtnText + DataBase.getDataBase(room+ "@" + itemInfo.이름.replace(/ /gi, ""));
            
        }
        replier.reply(rtnText);

    }

    if (order == "남의장수") {

        if (parameter.length == 0) {
            replier.reply("누구것을 보시겠소");

        } else {

            var senderName = sender.trim().replace(/ /gi,"").split("(")[0].split("/")[0];
            var targetName = parameter[0];

            var dbName = room + "@" + targetName+"장수";
            var content = DataBase.getDataBase(dbName);

            if (content == null) {
                replier.reply("저장되지 않은 사람입니다.");
            }else {
                rtnText = "";
                var content = DataBase.getDataBase(dbName);
                var memberList = [];
                if(content != null) {
                    memberList = content.split(",");
                };
                if (senderName.trim() == targetName.trim()) {
                    rtnText = "※자신은 남이 아니에요 자신을 사랑해주세요." + crlf
                }
                rtnText = rtnText + targetName + "님의 최종장수 총 " + memberList.length+"명";
                
                memberList.sort();
                if (memberList.length > 0) {
    
                    rtnText = rtnText + crlf + content;
                }
    
                replier.reply(rtnText);
            }
        }
        
    }

    //14.장수관리
    if (order == "내장수") {

        var senderName = sender.trim().replace(/ /gi,"").split("(")[0].split("/")[0];
        var dbName = room + "@" + senderName+"장수";
        rtnText = "";

        if (parameter.length == 0) {

            rtnText = "내장수 데이터 사용법" + crlf;
            rtnText = rtnText + " 개인의 장수데이터를 저장하고 분석합니다." + crlf;
            rtnText = rtnText + " /내장수 보기" + crlf;
            rtnText = rtnText + "  - 저장한 내 장수를 출력합니다." + crlf;
            rtnText = rtnText + " /내장수 추가 [장수명1] [장수명2] .." + crlf;
            rtnText = rtnText + "  - 띄어쓰기로 나열한 장수를 추가합니다." + crlf;
            rtnText = rtnText + " /내장수 삭제 [장수명1] [장수명2] .." + crlf;
            rtnText = rtnText + "  - 띄어쓰기로 나열한 장수를 삭제합니다." + crlf;
            rtnText = rtnText + " /내장수 전체삭제" + crlf;
            rtnText = rtnText + "  - 저장해놓은 내 장수를 전부 삭제합니다." + crlf;
            rtnText = rtnText + " /내장수 추천병참" + crlf;
            rtnText = rtnText + "  - 병참관리를 추천합니다.(개발중)" + crlf;
            rtnText = rtnText + " /내장수 추천전장 [전장명]" + crlf;
            rtnText = rtnText + "  - 특정 전장에서 사용가능한 장수를 출력합니다." + crlf;
            rtnText = rtnText + " /내장수 계보" + crlf;
            rtnText = rtnText + "  - 각 계보별 장수최종현황을 출력합니다." + crlf;

            replier.reply(rtnText);

        } else if (parameter[0] == "보기") {
            var content = DataBase.getDataBase(dbName);
            var memberList = [];
            if(content != null) {
                memberList = content.split(",");
            }
            rtnText = senderName + "님의 최종장수 총 " + memberList.length+"명";

            if (memberList.length > 0) {

                rtnText = rtnText + crlf + content;
            }

            replier.reply(rtnText);

        } else if (parameter[0] == "추가") {

            var insertMemberList = parameter.slice(1);

            if (insertMemberList.length == 0) {

            } else {

                var content = DataBase.getDataBase(dbName);
                var orgMemberList = [];

                if (content != null) {

                    orgMemberList = content.split(",");
                }
                var cnt = 0;
                var newMemberList = orgMemberList;

                for (var i = 0 ; i < insertMemberList.length ; i++) {
                    
                    var existFlg = false;
                    for (var j = 0 ; j < orgMemberList.length ; j++) {
                        if (orgMemberList[j] == insertMemberList[i]) {
                            existFlg = true;
                        }
                        
                    }
                    if (!existFlg) {

                        var availFlg = false;

                        for (var j = 0 ; j < memberInfoList.length ; j++) {

                            if ((memberInfoList[j].별칭 == "" && memberInfoList[j].이름 == insertMemberList[i]) || (memberInfoList[j].별칭 != "" && memberInfoList[j].별칭 == insertMemberList[i])) {
                                availFlg = true;
                            }
                        }

                        if (availFlg) {
                            newMemberList.push(insertMemberList[i]);
                            cnt++;
                        }
                    }

                    
                }
                rtnText = senderName+"님의 장수가" + cnt + "명 추가되었습니다." + crlf

                rtnText = rtnText + senderName + "님의 최종장수 총 " + newMemberList.length+"명";
                newMemberList.sort();
                if (newMemberList.length > 0) {

                    rtnText = rtnText + crlf + newMemberList.join(",");
                }
                DataBase.setDataBase(dbName, newMemberList.join(","));
                replier.reply(rtnText);
            }
        } else if (parameter[0] == "전체삭제") {

            DataBase.removeDataBase(dbName);
            replier.reply(senderName+"님의 장수가 남김없이^^ 삭제되었습니다.");
            
        } else if (parameter[0] == "삭제") {

            var deleteMemberList = parameter.slice(1);

            if (deleteMemberList.length > 0) {

                var content = DataBase.getDataBase(dbName);
                var orgMemberList = [];
                if (content != null) {
                    orgMemberList = content.split(",");
                }
                var cnt = 0;
                var newMemberList = [];
    
                for (var i = 0 ; i < orgMemberList.length ; i++) {
                    var deleteFlg = false;
                    for (var j = 0 ; j < deleteMemberList.length ; j++) {
                        
                        if (orgMemberList[i] == deleteMemberList[j]) {
                            
                            deleteFlg = true;
                            cnt++;
                        }
                
                    }

                    if (!deleteFlg) {
                        newMemberList.push(orgMemberList[i]);
                    }
                }
                rtnText = senderName+"님의 장수가" + cnt + "명 삭제되었습니다."+crlf;
                
                rtnText = rtnText + senderName + "님의 최종장수 총 " + newMemberList.length+"명";
                newMemberList.sort();
                if (newMemberList.length > 0) {

                    rtnText = rtnText + crlf + newMemberList.join(",");
                }

                DataBase.setDataBase(dbName, newMemberList.join(","));
                replier.reply(rtnText);
            }

        } else if (parameter[0] == "추천병참") {
            
            replier.reply("개발중입니다.")
            
        } else if (parameter[0] == "추천전장") {
            
            if (parameter.length == 2) {
                
                var recommend = [];
                if (parameter[1] == "도성") {
                    recommend.push("군주")
                    recommend.push("중기병")
                    recommend.push("경기병")
                    recommend.push("노병")
                    recommend.push("궁기병")
                    recommend.push("현자")
                    recommend.push("도사")
                    recommend.push("포차")
                    recommend.push("군악대")
                } else if (parameter[1] == "초원") {
                    recommend.push("군주")
                    recommend.push("천자")
                    recommend.push("경기병")
                    recommend.push("궁기병")
                    recommend.push("창병")
                    recommend.push("책사")
                    recommend.push("검사")
                    recommend.push("호술사")
                    recommend.push("포차")
                    recommend.push("군악대")

                }  else if (parameter[1] == "사막") {
                    recommend.push("웅술사")
                    recommend.push("적병")
                    recommend.push("궁병")
                    recommend.push("마왕")
                    recommend.push("산악기병")
                    recommend.push("효기병")
                    recommend.push("노전차")
                    recommend.push("전차")
                    recommend.push("무희")
                    recommend.push("풍수사")
                    recommend.push("군악대")

                }  else if (parameter[1] == "장강") {
                    recommend.push("보병")
                    recommend.push("창병")
                    recommend.push("궁병")
                    recommend.push("도독")
                    recommend.push("마왕")
                    recommend.push("검사")
                    recommend.push("수군")
                    recommend.push("무인")
                    recommend.push("무희")
                    recommend.push("풍수사")
                    recommend.push("군악대")

                }  else if (parameter[1] == "산지") {
                    recommend.push("적병")
                    recommend.push("웅술사")
                    recommend.push("노병")
                    recommend.push("책사")
                    recommend.push("산악기병")
                    recommend.push("호술사")
                    recommend.push("창병")
                    recommend.push("도사")
                    recommend.push("군악대")
                    recommend.push("천자")

                }  else if (parameter[1] == "설원") {
                    recommend.push("보병")
                    recommend.push("중기병")
                    recommend.push("현자")
                    recommend.push("노전차")
                    recommend.push("효기병")
                    recommend.push("수군")
                    recommend.push("전차")
                    recommend.push("도독")
                    recommend.push("풍수사")
                    recommend.push("무인")
                    recommend.push("군악대")

                }  else if (parameter[1] == "난투") {
                    replier.reply(parameter[1] + "전장은 전 장수 지형상성이 좋다는데요?")
                    return;
                } else {
                    replier.reply(parameter[1] + "전장은 취급하지 않아요 멍멍")
                    return;
                }

                var content = DataBase.getDataBase(dbName);
                var savedMemberList = [];
    
                if (content != null) {
                    savedMemberList = content.split(",");
    
                }
                rtnText = parameter[1]+"사용 가능 장수 총 @@@명";
                var cnt = 0;
                var newLineflg = true;
                for (var j = 0; j < savedMemberList.length ; j++) {
                    
                    for (var i = 0; i < memberInfoList.length ;i++) {
    
                        if ((memberInfoList[i].별칭 == "" && memberInfoList[i].이름 == savedMemberList[j]) || (memberInfoList[i].별칭 != "" && memberInfoList[i].별칭 == savedMemberList[j])) {
    
    
                            for (var k = 0; k < recommend.length ; k++) {
                                if (memberInfoList[i].병종 == recommend[k]) {
                                    if (newLineflg) {
                                        rtnText = rtnText + crlf
                                    } else {
                                        rtnText = rtnText + ",";
                                    }
                                    newLineflg = !newLineflg 
                                    cnt ++;
                                    rtnText = rtnText + (memberInfoList[i].별칭 == "" ? memberInfoList[i].이름 : memberInfoList[i].별칭)+"("+(memberInfoList[i].코스트+10)+")[" + memberInfoList[i].병종+"]";
                                    
                                    
                                }
                            }
                        }
    
                    }
                    
    
                }

                replier.reply(rtnText.replace("@@@",cnt)+crlf+"-장수특성으로 인한 지형상성 변경은 취급하지 않습니다.");
            }



        } else if (parameter[0] == "병종통계") {

            var savedMemberList = DataBase.getDataBase();

        } else if (parameter[0] == "추천태수") {

        } else if (parameter[0] == "계보") {

            var categoryMap = {};

            for (var i = 0 ; i < memberInfoList.length; i++) {

                if (categoryMap[memberInfoList[i].계보] == null) {

                    categoryMap[memberInfoList[i].계보] = {
                        info : memberInfoList[i],
                        totalSize : 0,
                        currentSize : 0
                    }
                }

                categoryMap[memberInfoList[i].계보].totalSize = categoryMap[memberInfoList[i].계보].totalSize + 1;

            }

            var content = DataBase.getDataBase(dbName);

            if (content != null) {
    
                var savedMemberList = content.split(",");
    
                for (var i = 0 ; i < savedMemberList.length ; i++) {
    
                    var m = find(memberInfoList, "이름", savedMemberList[i], true);
                    
                    if (categoryMap[m.계보] != null) {
    
                        categoryMap[m.계보].currentSize = categoryMap[m.계보].currentSize + 1;
                    }
    
                }
    
            }

            rtnText = "☆"+senderName+"님 계보작 현황" + crlf;
            var i = 0;
            for (var key in categoryMap) {
            //for (let [key, value] of Object.entries(categoryMap)) {

                var ts = categoryMap[key].totalSize;
                var cs = categoryMap[key].currentSize;
                var rt = Math.round(cs/ts * 100);
                var name = `${key}`.replace("의 패","");

                if (i != 0 && i % 2 == 0) {

                    rtnText = rtnText + crlf;
                } else {
                    
                    if (i != 0) {

                        rtnText = rtnText + ", ";
                    }
                }

                rtnText = rtnText + name+ `[` +rt+ `%(`+ (cs+"").zf(2) +`/` +(ts+"").zf(2)+ `)]`;

                i++;

                //console.log(`${key}: ${value}`);

            }

            replier.reply(rtnText);

            
    
            
        }



    }

    if (order == "상태이상") {
        rtnText = "상태이상 목록" + crlf;
        var cnt = 0;
        for (var i = 0 ; i < descriptionList.length ; i++) {

            
            if (descriptionList[i].장수특성.indexOf("상태:") == 0) {

                rtnText = rtnText + descriptionList[i].장수특성.replace("상태:","") + ", ";
                if (cnt % 3 == 0 && cnt != 0) {

                    rtnText = rtnText + crlf;
                }
                cnt++;
            }


        }

        replier.reply(rtnText);
    }

    if (order == "연합전") {
        var senderName = sender.trim().replace(/ /gi,"").split("(")[0].split("/")[0];
        if (parameter.length == 0) {

            rtnText = "연합전 메뉴(Beta) 사용방법" + crlf;
            rtnText = rtnText + " /연합전 제목 [코멘트]" + crlf
            rtnText = rtnText + " --해당날짜의 연합전의 제목" + crlf
            rtnText = rtnText + " /연합전 참가 [병종] [가능or불가능] [닉네임]" + crlf
            rtnText = rtnText + " --[병종]:참가할 병종" + crlf
            rtnText = rtnText + " --[가능or불가능]:디스코드 참가여부" + crlf
            rtnText = rtnText + " --[닉네임]:타인의 닉네임(본인의 경우 입력x)" + crlf
            rtnText = rtnText + " /연합전 불참가 [닉네임]" + crlf
            rtnText = rtnText + " -- 신청한 참가를 삭제한다.(본인의 경우 입력x)" + crlf
            rtnText = rtnText + " /연합전 보기" + crlf
            rtnText = rtnText + " -- 연합전 참여명단을 확인한다" + crlf
            rtnText = rtnText + " /연합전 [병종]" + crlf
            rtnText = rtnText + " -- 병종정보를 확인한다"
            

            replier.reply(rtnText);
        } else {
            if (parameter[0] == "제목") {
                var yh = new YH(room,t());

                yh.comment = parameter.slice(1).join(" ");

                yh.save(room);

                rtnText = "반영되었습니다."+crlf;
                replier.reply(rtnText + yh.print());

            } else if (parameter[0] == "참가" || parameter[0] == "참여") {

                var type = "";
                var isDiscode = "N";
                var targetName = "";

                if (parameter[1] != null) {
                    type = parameter[1];
                }
                if (parameter[2] != null) {
                    isDiscode = parameter[2];
                }
                if (parameter[3] != null) {
                    targetName = parameter[3];
                }else {
                    targetName = senderName;
                }

                var yh = new YH(room,t());

                yh.addMember(targetName,type,isDiscode);
                yh.save(room);
                rtnText = "반영되었습니다."+crlf;
                replier.reply(rtnText + yh.print());
                
                
            } else if (parameter[0] == "불참가" || parameter[0] == "불참" || parameter[0] == "불참여") {
                var targetName = senderName;

                if (parameter[1] != null) {
                    targetName = parameter[1];
                }
                var yh = new YH(room,t());

                yh.removeMember(targetName);
                yh.save(room);
                rtnText = "반영되었습니다."+crlf;
                replier.reply(rtnText + yh.print());

            } else if (parameter[0] == "보기") {

                var yh = new YH(room,t());

                replier.reply(yh.print());
            } else {

                if (armKbn.indexOf(parameter[0]) > -1) {

                    var k1 = "";
                    var k2 = "";
            
                    rtnText = "연합전 병종 " + parameter[0] + "정보" + crlf;
            
                    rtnText = rtnText + "■@1" + crlf;
                    rtnText = rtnText + "■@2"
            
                    for (var i = 0 ; i < armyList.length ; i++) {
            
                        if (armyList[i].병종구분 == parameter[0] && armyList[i].상위병종 != "") {
            
                            k1 = armyList[i].병종효과1;
                            k2 = armyList[i].병종효과2;
                            
            
                            rtnText = rtnText + crlf + " -" + armyList[i].병종+"("+armyList[i].상위병종+")";
            
                            
                        }
                    }

                    if (DataBase.getDataBase(room+ "@" + parameter[0].replace(/ /gi, "")) != null) {
                        rtnText = rtnText + crlf + "☆대조연코멘트" + crlf
                        rtnText = rtnText + DataBase.getDataBase(room+ "@" + parameter[0].replace(/ /gi, ""));
                        
                    }
            
                    replier.reply(rtnText.replace("@1", k1).replace("@2",k2));
                }

                var orgin = null;
                var upper = null;
                var upperName = "";

                for (var i = 0 ; i < armyList.length ; i++) {
                    if (armyList[i].상위병종 != "") {
                        
                        if (parameter[0] == armyList[i].병종 || parameter[0] == armyList[i].상위병종) {
    
                            orgin = armyList[i];
                            upperName = orgin.상위병종;
                        }
                    }

                    if (armyList[i].상위병종 == "") {

                        if (upperName == armyList[i].병종) {
                            upper = armyList[i];
                        }
                    }
                }

                if (orgin != null) {

                    console.log(orgin.병종);
                    console.log(upper.병종);

                    rtnText = "★" + orgin.병종구분 + ":" + orgin.병종;
    
                    rtnText = rtnText + "("+orgin.상위병종+")";
    
                    rtnText = rtnText + crlf + "병종효과1:" + orgin.병종효과1;
                    rtnText = rtnText + crlf + "병종효과2:" + orgin.병종효과2;
                    if (orgin.병종효과3 != "") {
    
                        rtnText = rtnText + crlf + "병종효과3:" + orgin.병종효과3; 
                    } else {
                        if (upper.병종효과3 != "") {
                            rtnText = rtnText + crlf + "병종효과3[승급]:" + upper.병종효과3; 
                        }
                    }
        
                    rtnText = rtnText + crlf + "-스킬 종류";
    
                    var upperSkillList = [];
                    for (var j = 0 ; j < upper.스킬.length ; j ++) {
    
                        if (orgin.스킬.indexOf(upper.스킬[j]) == -1) {
                            upperSkillList.push(upper.스킬[j]);
                        }
                    }
        
                    for (var j = 0 ; j < orgin.스킬.length ; j ++) {
                        if (orgin.스킬[j] != "") {
    
                            rtnText = rtnText + crlf + " -" + orgin.스킬[j] +":"+armySkillInfoMap[orgin.스킬[j]];
                        }
                    }
    
                    rtnText = rtnText + crlf + " ■최종승급 이후 스킬"
    
                    for (var j = 0 ; j < upperSkillList.length ; j ++) {
                        if (upper.스킬[j] != "") {
    
                            rtnText = rtnText + crlf + " -" + upperSkillList[j] +":"+armySkillInfoMap[upperSkillList[j]];
                        }
                    }
        
                    if (DataBase.getDataBase(room+ "@" + orgin.병종.replace(/ /gi, "")) != null) {
                        rtnText = rtnText + crlf + "☆대조연코멘트" + crlf
                        rtnText = rtnText + DataBase.getDataBase(room+ "@" + orgin.병종.replace(/ /gi, ""));
                        
                    }
    
                    replier.reply(rtnText);
                }


            }
            
        }
    }







}

function configMemberInfoList() {

    return [
        {	"이름" : "강보",	"병종" : "보병",	"코스트" : 4,	"계보" : "난세간웅의 패",	"무력" : 60,	"지력" : 70,	"통솔력" : 80,	"순발력" : 60,	"행운" : 60,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "전 방어율 증가",	"특성30상세" : "5",	"특성50" : "HP 보조%",	"특성50상세" : "15",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "70",	},
        {	"이름" : "만기",	"병종" : "경기병",	"코스트" : 5,	"계보" : "난세간웅의 패",	"무력" : 80,	"지력" : 60,	"통솔력" : 70,	"순발력" : 60,	"행운" : 60,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "물리 피해 감소%",	"특성90상세" : "10",	"태수효과" : "항만",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "104",	},
        {	"이름" : "유궁",	"병종" : "궁병",	"코스트" : 4,	"계보" : "난세간웅의 패",	"무력" : 70,	"지력" : 60,	"통솔력" : 60,	"순발력" : 60,	"행운" : 80,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "공격 명중률 증가",	"특성50상세" : "15",	"특성70" : "무제한 반격",	"특성70상세" : "",	"특성90" : "지원 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "사주 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "42",	},
        {	"이름" : "하후연",	"병종" : "궁기병",	"코스트" : 11,	"계보" : "난세간웅의 패",	"무력" : 92,	"지력" : 62,	"통솔력" : 80,	"순발력" : 84,	"행운" : 75,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "기습 공격%",	"특성30상세" : "3",	"특성50" : "신출귀몰",	"특성50상세" : "",	"특성70" : "파진 공격",	"특성70상세" : "15",	"특성90" : "일기당천",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "서주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "17",	},
        {	"이름" : "하후돈",	"병종" : "경기병",	"코스트" : 11,	"계보" : "난세간웅의 패",	"무력" : 90,	"지력" : 64,	"통솔력" : 77,	"순발력" : 94,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "50",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "주동 공격",	"특성70상세" : "",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "19",	},
        {	"이름" : "악진",	"병종" : "보병",	"코스트" : 10,	"계보" : "난세간웅의 패",	"무력" : 84,	"지력" : 54,	"통솔력" : 80,	"순발력" : 76,	"행운" : 86,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "전 방어율 증가",	"특성30상세" : "10",	"특성50" : "분노 축적%",	"특성50상세" : "20",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "청주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "12",	},
        {	"이름" : "이전",	"병종" : "노병",	"코스트" : 9,	"계보" : "난세간웅의 패",	"무력" : 77,	"지력" : 81,	"통솔력" : 78,	"순발력" : 73,	"행운" : 92,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "조준 사격%",	"특성30상세" : "4",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "인도 공격",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "14",	},
        {	"이름" : "조홍",	"병종" : "보병",	"코스트" : 6,	"계보" : "난세간웅의 패",	"무력" : 64,	"지력" : 82,	"통솔력" : 78,	"순발력" : 66,	"행운" : 70,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "분노 축적%",	"특성50상세" : "20",	"특성70" : "공격 방어율 증가",	"특성70상세" : "20",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "예주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "47",	},
        {	"이름" : "조인",	"병종" : "중기병",	"코스트" : 11,	"계보" : "난세간웅의 패",	"무력" : 93,	"지력" : 67,	"통솔력" : 90,	"순발력" : 63,	"행운" : 85,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "본대 견고",	"특성30상세" : "",	"특성50" : "연속 책략 면역",	"특성50상세" : "",	"특성70" : "피해 전가",	"특성70상세" : "",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "6",	},
        {	"이름" : "전위",	"병종" : "무인",	"코스트" : 11,	"계보" : "난세간웅의 패",	"무력" : 95,	"지력" : 32,	"통솔력" : 72,	"순발력" : 97,	"행운" : 68,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "전화위복",	"특성30상세" : "",	"특성50" : "피해 범위 변경",	"특성50상세" : "2격",	"특성70" : "권토중래",	"특성70상세" : "",	"특성90" : "일기당천",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "13",	},
        {	"이름" : "순욱",	"병종" : "책사",	"코스트" : 10,	"계보" : "난세간웅의 패",	"무력" : 54,	"지력" : 97,	"통솔력" : 77,	"순발력" : 56,	"행운" : 76,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "화계 책략 특화%",	"특성50상세" : "20",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "연속 책략",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "9",	},
        {	"이름" : "순유",	"병종" : "풍수사",	"코스트" : 8,	"계보" : "난세간웅의 패",	"무력" : 34,	"지력" : 94,	"통솔력" : 77,	"순발력" : 66,	"행운" : 78,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "주위 각성",	"특성30상세" : "",	"특성50" : "연속 공격 면역",	"특성50상세" : "",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "23",	},
        {	"이름" : "조조",	"병종" : "군주",	"코스트" : 11,	"계보" : "난세간웅의 패",	"무력" : 75,	"지력" : 96,	"통솔력" : 97,	"순발력" : 73,	"행운" : 76,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "구사일생",	"특성30상세" : "",	"특성50" : "지형 효과 보조",	"특성50상세" : "",	"특성70" : "일치단결",	"특성70상세" : "",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "10",	},
        {	"이름" : "곽가",	"병종" : "도사",	"코스트" : 10,	"계보" : "낭고중달의 패",	"무력" : 22,	"지력" : 96,	"통솔력" : 71,	"순발력" : 77,	"행운" : 87,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "장계취계",	"특성30상세" : "20",	"특성50" : "연속 책략",	"특성50상세" : "",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "10",	},
        {	"이름" : "정욱",	"병종" : "책사",	"코스트" : 8,	"계보" : "낭고중달의 패",	"무력" : 69,	"지력" : 91,	"통솔력" : 89,	"순발력" : 78,	"행운" : 86,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "공격 책략 강화%",	"특성30상세" : "10",	"특성50" : "책략 명중률 증가",	"특성50상세" : "15",	"특성70" : "사신 소환",	"특성70상세" : "",	"특성90" : "방어 능력 전환",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "26",	},
        {	"이름" : "우금",	"병종" : "궁병",	"코스트" : 9,	"계보" : "낭고중달의 패",	"무력" : 77,	"지력" : 72,	"통솔력" : 85,	"순발력" : 92,	"행운" : 63,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "근거리 궁술",	"특성30상세" : "",	"특성50" : "접근 사격",	"특성50상세" : "",	"특성70" : "후퇴 공격",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "11",	},
        {	"이름" : "유엽",	"병종" : "포차",	"코스트" : 8,	"계보" : "낭고중달의 패",	"무력" : 72,	"지력" : 92,	"통솔력" : 78,	"순발력" : 52,	"행운" : 82,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "조준 사격%",	"특성30상세" : "4",	"특성50" : "공격 명중률 증가",	"특성50상세" : "17",	"특성70" : "본대 강행",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "70",	},
        {	"이름" : "허저",	"병종" : "적병",	"코스트" : 11,	"계보" : "낭고중달의 패",	"무력" : 97,	"지력" : 36,	"통솔력" : 74,	"순발력" : 68,	"행운" : 98,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "일격 필살",	"특성30상세" : "",	"특성50" : "피해 범위 변경",	"특성50상세" : "2격",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "일기당천",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "3",	},
        {	"이름" : "서황",	"병종" : "창병",	"코스트" : 11,	"계보" : "낭고중달의 패",	"무력" : 90,	"지력" : 78,	"통솔력" : 91,	"순발력" : 68,	"행운" : 86,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 관통",	"특성30상세" : "10",	"특성50" : "연속 책략 면역",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "인도 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "5",	},
        {	"이름" : "만총",	"병종" : "풍수사",	"코스트" : 7,	"계보" : "낭고중달의 패",	"무력" : 71,	"지력" : 90,	"통솔력" : 84,	"순발력" : 78,	"행운" : 70,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "MP 보조%",	"특성30상세" : "15",	"특성50" : "주위 집중",	"특성50상세" : "",	"특성70" : "사신 소환",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "33",	},
        {	"이름" : "초선",	"병종" : "무희",	"코스트" : 10,	"계보" : "낭고중달의 패",	"무력" : 71,	"지력" : 83,	"통솔력" : 67,	"순발력" : 100,	"행운" : 87,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 기합",	"특성50상세" : "",	"특성70" : "MP 공격",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "4",	},
        {	"이름" : "장료",	"병종" : "경기병",	"코스트" : 11,	"계보" : "낭고중달의 패",	"무력" : 94,	"지력" : 80,	"통솔력" : 83,	"순발력" : 75,	"행운" : 91,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "신출귀몰",	"특성50상세" : "",	"특성70" : "주동 공격",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "병주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "14",	},
        {	"이름" : "가후",	"병종" : "도사",	"코스트" : 9,	"계보" : "낭고중달의 패",	"무력" : 52,	"지력" : 97,	"통솔력" : 68,	"순발력" : 85,	"행운" : 75,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "연속 공격 면역",	"특성30상세" : "",	"특성50" : "연속 책략",	"특성50상세" : "",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "방어 능력 전환",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "옹주(동) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "13",	},
        {	"이름" : "장합",	"병종" : "궁기병",	"코스트" : 10,	"계보" : "낭고중달의 패",	"무력" : 89,	"지력" : 82,	"통솔력" : 68,	"순발력" : 74,	"행운" : 92,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "지원 공격",	"특성30상세" : "",	"특성50" : "장거리 궁술",	"특성50상세" : "",	"특성70" : "주동 공격",	"특성70상세" : "",	"특성90" : "피해 범위 변경",	"특성90상세" : "2격",	"태수효과" : "경작",	"군주효과" : "옹주(동) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "27",	},
        {	"이름" : "조비",	"병종" : "군주",	"코스트" : 7,	"계보" : "낭고중달의 패",	"무력" : 75,	"지력" : 84,	"통솔력" : 92,	"순발력" : 58,	"행운" : 93,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "상태이상 반사",	"특성30상세" : "",	"특성50" : "주위 집중",	"특성50상세" : "",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "27",	},
        {	"이름" : "사마의",	"병종" : "현자",	"코스트" : 11,	"계보" : "낭고중달의 패",	"무력" : 67,	"지력" : 98,	"통솔력" : 98,	"순발력" : 79,	"행운" : 86,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 모방",	"특성30상세" : "",	"특성50" : "풍계 책략 전문화%",	"특성50상세" : "20",	"특성70" : "방어 능력 전환",	"특성70상세" : "",	"특성90" : "간접 피해 감소%",	"특성90상세" : "70",	"태수효과" : "은전 징세",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "4",	},
        {	"이름" : "엄정",	"병종" : "궁병",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 52,	"지력" : 63,	"통솔력" : 59,	"순발력" : 64,	"행운" : 71,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "본대 연병",	"특성30상세" : "",	"특성50" : "맹독 공격%",	"특성50상세" : "50",	"특성70" : "공격 명중률 증가",	"특성70상세" : "20",	"특성90" : "공격력 보조%",	"특성90상세" : "15",	"태수효과" : "은전 징세",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "41",	},
        {	"이름" : "배원소",	"병종" : "적병",	"코스트" : 5,	"계보" : "대현량사의 패",	"무력" : 72,	"지력" : 26,	"통솔력" : 55,	"순발력" : 56,	"행운" : 74,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "지계 책략 강화%",	"특성30상세" : "10",	"특성50" : "반격 강화",	"특성50상세" : "",	"특성70" : "공격력 보조%",	"특성70상세" : "13",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "62",	},
        {	"이름" : "장위",	"병종" : "경기병",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 74,	"지력" : 55,	"통솔력" : 70,	"순발력" : 61,	"행운" : 65,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "주위 고양",	"특성50상세" : "",	"특성70" : "주위 방해",	"특성70상세" : "",	"특성90" : "연속 책략 면역",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "127",	},
        {	"이름" : "장로",	"병종" : "군주",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 52,	"지력" : 78,	"통솔력" : 60,	"순발력" : 52,	"행운" : 76,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "주위 고양",	"특성70상세" : "",	"특성90" : "지형 효과 보조",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "옹주(동) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "70",	},
        {	"이름" : "염포",	"병종" : "책사",	"코스트" : 5,	"계보" : "대현량사의 패",	"무력" : 49,	"지력" : 85,	"통솔력" : 56,	"순발력" : 62,	"행운" : 65,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "원소 책략 강화%",	"특성30상세" : "5",	"특성50" : "지계 책략 강화%",	"특성50상세" : "15",	"특성70" : "연속 책략 강화",	"특성70상세" : "",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "57",	},
        {	"이름" : "하진",	"병종" : "중기병",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 45,	"지력" : 28,	"통솔력" : 48,	"순발력" : 72,	"행운" : 97,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "능력 이상 공격%",	"특성50상세" : "15",	"특성70" : "분노 축적%",	"특성70상세" : "20",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "49",	},
        {	"이름" : "공도",	"병종" : "적병",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 72,	"지력" : 36,	"통솔력" : 55,	"순발력" : 58,	"행운" : 82,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "주위 허탈",	"특성30상세" : "",	"특성50" : "사기 보조%",	"특성50상세" : "10",	"특성70" : "간접 피해 감소%",	"특성70상세" : "10",	"특성90" : "연속 공격 강화%",	"특성90상세" : "15",	"태수효과" : "수산물",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "64",	},
        {	"이름" : "고승",	"병종" : "적병",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 74,	"지력" : 18,	"통솔력" : 58,	"순발력" : 69,	"행운" : 77,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "지계 책략 강화%",	"특성30상세" : "10",	"특성50" : "사기 보조%",	"특성50상세" : "10",	"특성70" : "주위 허탈",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "68",	},
        {	"이름" : "관해",	"병종" : "창병",	"코스트" : 6,	"계보" : "대현량사의 패",	"무력" : 84,	"지력" : 34,	"통솔력" : 73,	"순발력" : 77,	"행운" : 52,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "주위 둔병",	"특성30상세" : "",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "돌진 공격%",	"특성90상세" : "4",	"태수효과" : "제재소",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "82",	},
        {	"이름" : "유벽",	"병종" : "궁병",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 68,	"지력" : 51,	"통솔력" : 74,	"순발력" : 52,	"행운" : 80,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "10",	"특성50" : "맹독 공격%",	"특성50상세" : "50",	"특성70" : "본대 연병",	"특성70상세" : "",	"특성90" : "공격력 보조%",	"특성90상세" : "15",	"태수효과" : "군량 징세",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "43",	},
        {	"이름" : "정원지",	"병종" : "무인",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 74,	"지력" : 22,	"통솔력" : 69,	"순발력" : 72,	"행운" : 58,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "돌진 공격%",	"특성30상세" : "2",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "주위 압박",	"특성70상세" : "",	"특성90" : "공격 범위 변경",	"특성90상세" : "몰우전",	"태수효과" : "수산물",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "128",	},
        {	"이름" : "하태후",	"병종" : "무희",	"코스트" : 5,	"계보" : "대현량사의 패",	"무력" : 46,	"지력" : 69,	"통솔력" : 55,	"순발력" : 76,	"행운" : 61,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "공격 방어율 증가",	"특성30상세" : "25",	"특성50" : "전 방어율 증가",	"특성50상세" : "10",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "분노 축적%",	"특성90상세" : "20",	"태수효과" : "군량 징세",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "32",	},
        {	"이름" : "장량",	"병종" : "도사",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 80,	"지력" : 74,	"통솔력" : 78,	"순발력" : 74,	"행운" : 56,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "10",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "상태이상 반사",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "기주 징세",	"별칭" : "노란장량",	"추천병종" : "책략훈련부",	"추천병종순" : "99",	},
        {	"이름" : "파재",	"병종" : "창병",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 64,	"지력" : 52,	"통솔력" : 85,	"순발력" : 81,	"행운" : 61,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "돌진 공격%",	"특성90상세" : "4",	"태수효과" : "은전 보관",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "64",	},
        {	"이름" : "장보",	"병종" : "도사",	"코스트" : 4,	"계보" : "대현량사의 패",	"무력" : 71,	"지력" : 81,	"통솔력" : 83,	"순발력" : 72,	"행운" : 62,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "방",	"특성30상세" : "10",	"특성50" : "주위 방해",	"특성50상세" : "",	"특성70" : "상태이상 반사",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "79",	},
        {	"이름" : "장만성",	"병종" : "무인",	"코스트" : 7,	"계보" : "대현량사의 패",	"무력" : 84,	"지력" : 46,	"통솔력" : 77,	"순발력" : 69,	"행운" : 89,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "8",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "연속 공격 강화%",	"특성90상세" : "15",	"태수효과" : "시장",	"군주효과" : "청주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "68",	},
        {	"이름" : "장각",	"병종" : "현자",	"코스트" : 9,	"계보" : "대현량사의 패",	"무력" : 27,	"지력" : 86,	"통솔력" : 90,	"순발력" : 88,	"행운" : 96,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "주위 집중",	"특성30상세" : "",	"특성50" : "책략 명중률 증가",	"특성50상세" : "15",	"특성70" : "연속 책략",	"특성70상세" : "",	"특성90" : "중황태을",	"특성90상세" : "15",	"태수효과" : "징세의 달인",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "21",	},
        {	"이름" : "고유",	"병종" : "풍수사",	"코스트" : 5,	"계보" : "군신운장의 패",	"무력" : 52,	"지력" : 77,	"통솔력" : 67,	"순발력" : 56,	"행운" : 76,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "15",	"특성50" : "주위 연병",	"특성50상세" : "",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "72",	},
        {	"이름" : "조안민",	"병종" : "궁기병",	"코스트" : 5,	"계보" : "군신운장의 패",	"무력" : 71,	"지력" : 64,	"통솔력" : 61,	"순발력" : 53,	"행운" : 84,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화%",	"특성30상세" : "15",	"특성50" : "부동 공격%",	"특성50상세" : "15",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "예주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "114",	},
        {	"이름" : "양염",	"병종" : "무희",	"코스트" : 6,	"계보" : "군신운장의 패",	"무력" : 34,	"지력" : 81,	"통솔력" : 56,	"순발력" : 72,	"행운" : 79,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "무반격 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "순발력 보조%",	"특성90상세" : "10",	"태수효과" : "시장",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "45",	},
        {	"이름" : "순의",	"병종" : "도사",	"코스트" : 4,	"계보" : "군신운장의 패",	"무력" : 26,	"지력" : 74,	"통솔력" : 59,	"순발력" : 72,	"행운" : 63,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "상태이상 반사",	"특성30상세" : "",	"특성50" : "주위 둔병",	"특성50상세" : "",	"특성70" : "책략 피해 반사%",	"특성70상세" : "10",	"특성90" : "MP 방어",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "예주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "98",	},
        {	"이름" : "방덕",	"병종" : "보병",	"코스트" : 10,	"계보" : "군신운장의 패",	"무력" : 91,	"지력" : 77,	"통솔력" : 89,	"순발력" : 62,	"행운" : 60,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "역전용사",	"특성50상세" : "10",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "10",	},
        {	"이름" : "여건",	"병종" : "궁기병",	"코스트" : 7,	"계보" : "군신운장의 패",	"무력" : 78,	"지력" : 65,	"통솔력" : 63,	"순발력" : 66,	"행운" : 86,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "방어력 하강 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "연주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "77",	},
        {	"이름" : "조앙",	"병종" : "경기병",	"코스트" : 8,	"계보" : "군신운장의 패",	"무력" : 84,	"지력" : 67,	"통솔력" : 74,	"순발력" : 62,	"행운" : 91,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "일기당천",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "물리 피해 감소%",	"특성90상세" : "10",	"태수효과" : "보관의 달인",	"군주효과" : "예주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "53",	},
        {	"이름" : "원술",	"병종" : "군주",	"코스트" : 7,	"계보" : "군신운장의 패",	"무력" : 64,	"지력" : 75,	"통솔력" : 58,	"순발력" : 82,	"행운" : 81,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "주위 고양",	"특성30상세" : "",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "33",	},
        {	"이름" : "조창",	"병종" : "산악기병",	"코스트" : 9,	"계보" : "군신운장의 패",	"무력" : 92,	"지력" : 58,	"통솔력" : 76,	"순발력" : 84,	"행운" : 63,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "정신력 하강 공격",	"특성30상세" : "",	"특성50" : "돌파 공격",	"특성50상세" : "",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "일기당천",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "34",	},
        {	"이름" : "위유",	"병종" : "노병",	"코스트" : 5,	"계보" : "군신운장의 패",	"무력" : 62,	"지력" : 75,	"통솔력" : 71,	"순발력" : 65,	"행운" : 79,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "본대 고양",	"특성30상세" : "",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "물리 공격 강화%",	"특성90상세" : "12",	"태수효과" : "견직",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "57",	},
        {	"이름" : "양봉",	"병종" : "창병",	"코스트" : 4,	"계보" : "군신운장의 패",	"무력" : 68,	"지력" : 48,	"통솔력" : 71,	"순발력" : 59,	"행운" : 68,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "책략 피해 감소%",	"특성90상세" : "15",	"태수효과" : "과수",	"군주효과" : "서주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "85",	},
        {	"이름" : "안량",	"병종" : "경기병",	"코스트" : 12,	"계보" : "군신운장의 패",	"무력" : 93,	"지력" : 42,	"통솔력" : 92,	"순발력" : 84,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "본대 기합",	"특성30상세" : "",	"특성50" : "일기당천",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "인도 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "12",	},
        {	"이름" : "관우",	"병종" : "중기병",	"코스트" : 13,	"계보" : "군신운장의 패",	"무력" : 97,	"지력" : 82,	"통솔력" : 96,	"순발력" : 68,	"행운" : 89,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "일격 필살",	"특성30상세" : "",	"특성50" : "책략 방어술%",	"특성50상세" : "40",	"특성70" : "인도 공격",	"특성70상세" : "",	"특성90" : "관성제군",	"특성90상세" : "10",	"태수효과" : "보관의 달인",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "1",	},
        {	"이름" : "형도영",	"병종" : "중기병",	"코스트" : 5,	"계보" : "동래자의의 패",	"무력" : 72,	"지력" : 52,	"통솔력" : 67,	"순발력" : 57,	"행운" : 81,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "기마 공격 강화 무시",	"특성70상세" : "",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(남) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "75",	},
        {	"이름" : "동승",	"병종" : "보병",	"코스트" : 4,	"계보" : "동래자의의 패",	"무력" : 59,	"지력" : 68,	"통솔력" : 69,	"순발력" : 70,	"행운" : 66,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "특수 공격 면역",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "기주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "86",	},
        {	"이름" : "사정",	"병종" : "경기병",	"코스트" : 4,	"계보" : "동래자의의 패",	"무력" : 71,	"지력" : 22,	"통솔력" : 64,	"순발력" : 74,	"행운" : 61,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 방해",	"특성30상세" : "",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "기마 공격 강화%",	"특성90상세" : "15",	"태수효과" : "군량 징세",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "134",	},
        {	"이름" : "공융",	"병종" : "책사",	"코스트" : 4,	"계보" : "동래자의의 패",	"무력" : 25,	"지력" : 79,	"통솔력" : 30,	"순발력" : 52,	"행운" : 91,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "화계 책략 강화%",	"특성50상세" : "15",	"특성70" : "사신 소환",	"특성70상세" : "",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "84",	},
        {	"이름" : "주령",	"병종" : "궁기병",	"코스트" : 8,	"계보" : "동래자의의 패",	"무력" : 78,	"지력" : 68,	"통솔력" : 81,	"순발력" : 62,	"행운" : 85,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "순발력 하강 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "62",	},
        {	"이름" : "주준",	"병종" : "경기병",	"코스트" : 8,	"계보" : "동래자의의 패",	"무력" : 70,	"지력" : 72,	"통솔력" : 89,	"순발력" : 74,	"행운" : 72,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "연속 책략 면역",	"특성50상세" : "",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "74",	},
        {	"이름" : "왕경",	"병종" : "창병",	"코스트" : 4,	"계보" : "동래자의의 패",	"무력" : 69,	"지력" : 70,	"통솔력" : 71,	"순발력" : 58,	"행운" : 72,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "주위 둔병",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "84",	},
        {	"이름" : "마막",	"병종" : "포차",	"코스트" : 4,	"계보" : "동래자의의 패",	"무력" : 66,	"지력" : 44,	"통솔력" : 56,	"순발력" : 56,	"행운" : 62,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "본대 연병",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "옹주(동) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "141",	},
        {	"이름" : "곽준",	"병종" : "보병",	"코스트" : 5,	"계보" : "동래자의의 패",	"무력" : 66,	"지력" : 73,	"통솔력" : 73,	"순발력" : 76,	"행운" : 54,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "책략 방어율 증가",	"특성30상세" : "10",	"특성50" : "전 방어율 증가",	"특성50상세" : "6",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(북) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "65",	},
        {	"이름" : "진림",	"병종" : "풍수사",	"코스트" : 5,	"계보" : "동래자의의 패",	"무력" : 26,	"지력" : 80,	"통솔력" : 77,	"순발력" : 72,	"행운" : 74,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "15",	"특성50" : "주위 집중",	"특성50상세" : "",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "68",	},
        {	"이름" : "무안국",	"병종" : "적병",	"코스트" : 8,	"계보" : "동래자의의 패",	"무력" : 87,	"지력" : 49,	"통솔력" : 72,	"순발력" : 69,	"행운" : 76,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "지계 책략 강화%",	"특성30상세" : "7",	"특성50" : "금격 공격%",	"특성50상세" : "15",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "신출귀몰",	"특성90상세" : "10",	"태수효과" : "시장",	"군주효과" : "청주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "30",	},
        {	"이름" : "주태",	"병종" : "수군",	"코스트" : 11,	"계보" : "동래자의의 패",	"무력" : 91,	"지력" : 48,	"통솔력" : 84,	"순발력" : 88,	"행운" : 67,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "피해 범위 변경",	"특성30상세" : "2격",	"특성50" : "철옹성",	"특성50상세" : "",	"특성70" : "방어력 보조%",	"특성70상세" : "13",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "18",	},
        {	"이름" : "태사자",	"병종" : "경기병",	"코스트" : 13,	"계보" : "동래자의의 패",	"무력" : 93,	"지력" : 69,	"통솔력" : 90,	"순발력" : 95,	"행운" : 72,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "공격 범위 변경",	"특성30상세" : "대폭염",	"특성50" : "파진 공격",	"특성50상세" : "",	"특성70" : "필마단기",	"특성70상세" : "6",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "9",	},
        {	"이름" : "번궁",	"병종" : "무인",	"코스트" : 6,	"계보" : "임협원직의 패",	"무력" : 73,	"지력" : 53,	"통솔력" : 62,	"순발력" : 79,	"행운" : 59,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "8",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "형주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "99",	},
        {	"이름" : "조모",	"병종" : "보병",	"코스트" : 6,	"계보" : "임협원직의 패",	"무력" : 50,	"지력" : 72,	"통솔력" : 81,	"순발력" : 66,	"행운" : 68,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "HP 보조%",	"특성30상세" : "15",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "연주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "44",	},
        {	"이름" : "공주",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "임협원직의 패",	"무력" : 56,	"지력" : 69,	"통솔력" : 44,	"순발력" : 61,	"행운" : 82,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "10",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "9",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "주위 각성",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "연주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "108",	},
        {	"이름" : "호질",	"병종" : "창병",	"코스트" : 4,	"계보" : "임협원직의 패",	"무력" : 58,	"지력" : 78,	"통솔력" : 78,	"순발력" : 66,	"행운" : 76,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "주위 둔병",	"특성70상세" : "",	"특성90" : "주위 허탈",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "74",	},
        {	"이름" : "맹달",	"병종" : "창병",	"코스트" : 7,	"계보" : "임협원직의 패",	"무력" : 77,	"지력" : 75,	"통솔력" : 82,	"순발력" : 50,	"행운" : 76,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화%",	"특성30상세" : "15",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "사주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "34",	},
        {	"이름" : "간옹",	"병종" : "궁병",	"코스트" : 6,	"계보" : "임협원직의 패",	"무력" : 61,	"지력" : 75,	"통솔력" : 72,	"순발력" : 64,	"행운" : 77,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "혼란 공격%",	"특성70상세" : "30",	"특성90" : "지원 공격",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "33",	},
        {	"이름" : "포신",	"병종" : "중기병",	"코스트" : 5,	"계보" : "임협원직의 패",	"무력" : 68,	"지력" : 74,	"통솔력" : 71,	"순발력" : 57,	"행운" : 64,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화 무시",	"특성30상세" : "",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "연주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "67",	},
        {	"이름" : "곽유지",	"병종" : "포차",	"코스트" : 6,	"계보" : "임협원직의 패",	"무력" : 33,	"지력" : 77,	"통솔력" : 42,	"순발력" : 64,	"행운" : 81,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "화상 공격%",	"특성30상세" : "30",	"특성50" : "책략 피해 감소%",	"특성50상세" : "15",	"특성70" : "물리 필중",	"특성70상세" : "",	"특성90" : "중독 공격%",	"특성90상세" : "30",	"태수효과" : "시장",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "42",	},
        {	"이름" : "유복",	"병종" : "도사",	"코스트" : 4,	"계보" : "임협원직의 패",	"무력" : 58,	"지력" : 78,	"통솔력" : 54,	"순발력" : 66,	"행운" : 88,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "상태이상 반사",	"특성30상세" : "",	"특성50" : "HP 보조%",	"특성50상세" : "15",	"특성70" : "방해계 책략 강화%",	"특성70상세" : "10",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "88",	},
        {	"이름" : "변희",	"병종" : "무인",	"코스트" : 5,	"계보" : "임협원직의 패",	"무력" : 74,	"지력" : 62,	"통솔력" : 56,	"순발력" : 84,	"행운" : 56,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "전화위복",	"특성30상세" : "",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "회심 공격 강화",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "110",	},
        {	"이름" : "장연",	"병종" : "적병",	"코스트" : 9,	"계보" : "임협원직의 패",	"무력" : 88,	"지력" : 54,	"통솔력" : 87,	"순발력" : 61,	"행운" : 85,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "본대 고양",	"특성30상세" : "",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "18",	},
        {	"이름" : "장기",	"병종" : "경기병",	"코스트" : 6,	"계보" : "임협원직의 패",	"무력" : 61,	"지력" : 82,	"통솔력" : 77,	"순발력" : 56,	"행운" : 77,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 방해",	"특성30상세" : "",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "반격 강화",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "113",	},
        {	"이름" : "서서",	"병종" : "책사",	"코스트" : 9,	"계보" : "임협원직의 패",	"무력" : 73,	"지력" : 93,	"통솔력" : 81,	"순발력" : 75,	"행운" : 80,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "5",	"특성50" : "간접 피해 감소%",	"특성50상세" : "70",	"특성70" : "사신 소환",	"특성70상세" : "",	"특성90" : "사막전 보조",	"특성90상세" : "10",	"태수효과" : "군량 징세",	"군주효과" : "전 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "17",	},
        {	"이름" : "신비",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "패왕본초의 패",	"무력" : 52,	"지력" : 81,	"통솔력" : 48,	"순발력" : 68,	"행운" : 76,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "주위 각성",	"특성30상세" : "",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "9",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "간접 피해 감소%",	"특성90상세" : "20",	"태수효과" : "시장",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "80",	},
        {	"이름" : "장의거",	"병종" : "보병",	"코스트" : 4,	"계보" : "패왕본초의 패",	"무력" : 65,	"지력" : 62,	"통솔력" : 75,	"순발력" : 68,	"행운" : 63,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "7",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "유주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "79",	},
        {	"이름" : "신평",	"병종" : "포차",	"코스트" : 6,	"계보" : "패왕본초의 패",	"무력" : 69,	"지력" : 79,	"통솔력" : 72,	"순발력" : 48,	"행운" : 82,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "물리 필중",	"특성30상세" : "",	"특성50" : "물리 피해 감소%",	"특성50상세" : "10",	"특성70" : "본대 연병",	"특성70상세" : "",	"특성90" : "중독 공격%",	"특성90상세" : "20",	"태수효과" : "절대 보호",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "106",	},
        {	"이름" : "국의",	"병종" : "궁기병",	"코스트" : 8,	"계보" : "패왕본초의 패",	"무력" : 92,	"지력" : 51,	"통솔력" : 72,	"순발력" : 80,	"행운" : 64,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "지원 공격",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "익주(북) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "46",	},
        {	"이름" : "고간",	"병종" : "궁기병",	"코스트" : 5,	"계보" : "패왕본초의 패",	"무력" : 66,	"지력" : 62,	"통솔력" : 74,	"순발력" : 56,	"행운" : 74,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "반격 강화",	"특성50상세" : "",	"특성70" : "지원 공격",	"특성70상세" : "",	"특성90" : "방어력 하강 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "121",	},
        {	"이름" : "원희",	"병종" : "중기병",	"코스트" : 4,	"계보" : "패왕본초의 패",	"무력" : 66,	"지력" : 63,	"통솔력" : 75,	"순발력" : 52,	"행운" : 54,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "본대 견고",	"특성30상세" : "",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "예주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "78",	},
        {	"이름" : "원상",	"병종" : "군주",	"코스트" : 6,	"계보" : "패왕본초의 패",	"무력" : 75,	"지력" : 56,	"통솔력" : 70,	"순발력" : 62,	"행운" : 75,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "주위 고양",	"특성50상세" : "",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "피해 범위 변경",	"특성90상세" : "2격",	"태수효과" : "보관의 달인",	"군주효과" : "예주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "53",	},
        {	"이름" : "봉기",	"병종" : "풍수사",	"코스트" : 5,	"계보" : "패왕본초의 패",	"무력" : 48,	"지력" : 85,	"통솔력" : 65,	"순발력" : 74,	"행운" : 76,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "8",	"특성50" : "MP 보조%",	"특성50상세" : "13",	"특성70" : "책략 방어율 증가",	"특성70상세" : "15",	"특성90" : "주위 견고",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "형주(북) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "58",	},
        {	"이름" : "저수",	"병종" : "책사",	"코스트" : 8,	"계보" : "패왕본초의 패",	"무력" : 52,	"지력" : 92,	"통솔력" : 77,	"순발력" : 60,	"행운" : 89,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "홍련탄 강화%",	"특성50상세" : "20",	"특성70" : "사신 소환",	"특성70상세" : "",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "25",	},
        {	"이름" : "전풍",	"병종" : "책사",	"코스트" : 8,	"계보" : "패왕본초의 패",	"무력" : 54,	"지력" : 93,	"통솔력" : 72,	"순발력" : 87,	"행운" : 68,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "책략 모방",	"특성50상세" : "",	"특성70" : "홍련탄 강화%",	"특성70상세" : "20",	"특성90" : "연속 책략",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "전 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "24",	},
        {	"이름" : "허유",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "패왕본초의 패",	"무력" : 46,	"지력" : 80,	"통솔력" : 30,	"순발력" : 66,	"행운" : 83,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "MP 보조%",	"특성30상세" : "15",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "9",	"특성70" : "책략 방어율 증가",	"특성70상세" : "15",	"특성90" : "주위 고양",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "82",	},
        {	"이름" : "원담",	"병종" : "경기병",	"코스트" : 4,	"계보" : "패왕본초의 패",	"무력" : 73,	"지력" : 52,	"통솔력" : 68,	"순발력" : 66,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "주위 고양",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "연속 공격 강화%",	"특성90상세" : "15",	"태수효과" : "과",	"군주효과" : "예주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "129",	},
        {	"이름" : "진진",	"병종" : "보병",	"코스트" : 7,	"계보" : "패왕본초의 패",	"무력" : 62,	"지력" : 76,	"통솔력" : 83,	"순발력" : 71,	"행운" : 72,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "전 방어율 증가",	"특성50상세" : "6",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "본대 강행",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "32",	},
        {	"이름" : "곽도",	"병종" : "도사",	"코스트" : 5,	"계보" : "패왕본초의 패",	"무력" : 50,	"지력" : 82,	"통솔력" : 53,	"순발력" : 73,	"행운" : 80,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "상태이상 반사",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "64",	},
        {	"이름" : "동소",	"병종" : "포차",	"코스트" : 6,	"계보" : "패왕본초의 패",	"무력" : 39,	"지력" : 80,	"통솔력" : 65,	"순발력" : 61,	"행운" : 62,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "본대 고양",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "연주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "147",	},
        {	"이름" : "저곡",	"병종" : "궁병",	"코스트" : 4,	"계보" : "패왕본초의 패",	"무력" : 66,	"지력" : 50,	"통솔력" : 62,	"순발력" : 78,	"행운" : 56,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "10",	"특성50" : "능력 이상 공격%",	"특성50상세" : "15",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "지원 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "36",	},
        {	"이름" : "순우경",	"병종" : "창병",	"코스트" : 7,	"계보" : "패왕본초의 패",	"무력" : 77,	"지력" : 45,	"통솔력" : 69,	"순발력" : 68,	"행운" : 81,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화%",	"특성30상세" : "15",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "기주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "79",	},
        {	"이름" : "고람",	"병종" : "궁기병",	"코스트" : 8,	"계보" : "패왕본초의 패",	"무력" : 82,	"지력" : 68,	"통솔력" : 76,	"순발력" : 80,	"행운" : 76,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "책략 피해 감소%",	"특성30상세" : "10",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "공격력 하강 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "56",	},
        {	"이름" : "심배",	"병종" : "책사",	"코스트" : 7,	"계보" : "패왕본초의 패",	"무력" : 50,	"지력" : 86,	"통솔력" : 80,	"순발력" : 77,	"행운" : 73,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "주위 견고",	"특성50상세" : "",	"특성70" : "사신 소환",	"특성70상세" : "",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "41",	},
        {	"이름" : "문추",	"병종" : "중기병",	"코스트" : 12,	"계보" : "패왕본초의 패",	"무력" : 95,	"지력" : 36,	"통솔력" : 86,	"순발력" : 72,	"행운" : 91,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "본대 견고",	"특성30상세" : "",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "재반격",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "4",	},
        {	"이름" : "원소",	"병종" : "군주",	"코스트" : 9,	"계보" : "패왕본초의 패",	"무력" : 72,	"지력" : 74,	"통솔력" : 87,	"순발력" : 80,	"행운" : 95,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "집중의 일격%",	"특성30상세" : "30",	"특성50" : "기합의 일격%",	"특성50상세" : "30",	"특성70" : "무반격 공격",	"특성70상세" : "",	"특성90" : "공격 범위 변경",	"특성90상세" : "몰우전",	"태수효과" : "보관의 달인",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "12",	},
        {	"이름" : "보협",	"병종" : "노병",	"코스트" : 4,	"계보" : "백언소후의 패",	"무력" : 65,	"지력" : 74,	"통솔력" : 78,	"순발력" : 70,	"행운" : 68,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "사기 하강 공격",	"특성30상세" : "",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "연속 공격 강화%",	"특성90상세" : "15",	"태수효과" : "경작",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "72",	},
        {	"이름" : "고옹",	"병종" : "책사",	"코스트" : 6,	"계보" : "백언소후의 패",	"무력" : 26,	"지력" : 86,	"통솔력" : 61,	"순발력" : 67,	"행운" : 81,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "수계 책략 강화%",	"특성50상세" : "15",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "46",	},
        {	"이름" : "유찬",	"병종" : "보병",	"코스트" : 8,	"계보" : "백언소후의 패",	"무력" : 81,	"지력" : 66,	"통솔력" : 82,	"순발력" : 64,	"행운" : 62,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "공격 방어율 증가",	"특성70상세" : "20",	"특성90" : "HP 보조%",	"특성90상세" : "15",	"태수효과" : "징세의 달인",	"군주효과" : "교주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "26",	},
        {	"이름" : "등윤",	"병종" : "보병",	"코스트" : 4,	"계보" : "백언소후의 패",	"무력" : 68,	"지력" : 72,	"통솔력" : 76,	"순발력" : 66,	"행운" : 70,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 방해",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "수전 보조",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "77",	},
        {	"이름" : "잠혼",	"병종" : "도사",	"코스트" : 4,	"계보" : "백언소후의 패",	"무력" : 13,	"지력" : 33,	"통솔력" : 24,	"순발력" : 55,	"행운" : 23,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "주위 허탈",	"특성50상세" : "",	"특성70" : "방해계 책략 강화%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "114",	},
        {	"이름" : "종리목",	"병종" : "산악기병",	"코스트" : 7,	"계보" : "백언소후의 패",	"무력" : 76,	"지력" : 74,	"통솔력" : 79,	"순발력" : 74,	"행운" : 68,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "기마 공격 강화 무시",	"특성30상세" : "",	"특성50" : "수전 보조",	"특성50상세" : "",	"특성70" : "주위 압박",	"특성70상세" : "",	"특성90" : "반격 강화",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "익주(북) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "81",	},
        {	"이름" : "진무",	"병종" : "궁병",	"코스트" : 10,	"계보" : "백언소후의 패",	"무력" : 87,	"지력" : 63,	"통솔력" : 76,	"순발력" : 89,	"행운" : 78,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "관통 사격",	"특성50상세" : "",	"특성70" : "피해 범위 변경",	"특성70상세" : "2격",	"특성90" : "방어력 하강 공격",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "7",	},
        {	"이름" : "능통",	"병종" : "중기병",	"코스트" : 10,	"계보" : "백언소후의 패",	"무력" : 89,	"지력" : 60,	"통솔력" : 77,	"순발력" : 68,	"행운" : 86,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "본대 견고",	"특성30상세" : "",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "천하무쌍%",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "15",	},
        {	"이름" : "진표",	"병종" : "노병",	"코스트" : 6,	"계보" : "백언소후의 패",	"무력" : 56,	"지력" : 78,	"통솔력" : 75,	"순발력" : 72,	"행운" : 67,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "본대 고양",	"특성70상세" : "",	"특성90" : "무제한 반격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "교주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "60",	},
        {	"이름" : "장윤",	"병종" : "수군",	"코스트" : 5,	"계보" : "백언소후의 패",	"무력" : 71,	"지력" : 54,	"통솔력" : 76,	"순발력" : 69,	"행운" : 52,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "수계 책략 강화%",	"특성30상세" : "7",	"특성50" : "공격 명중률 증가",	"특성50상세" : "15",	"특성70" : "사기 보조%",	"특성70상세" : "10",	"특성90" : "책략 피해 감소%",	"특성90상세" : "15",	"태수효과" : "군량 보관",	"군주효과" : "형주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "115",	},
        {	"이름" : "손노반",	"병종" : "도사",	"코스트" : 4,	"계보" : "백언소후의 패",	"무력" : 74,	"지력" : 63,	"통솔력" : 62,	"순발력" : 83,	"행운" : 84,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "8",	"특성50" : "HP 보조%",	"특성50상세" : "15",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "111",	},
        {	"이름" : "주이",	"병종" : "궁기병",	"코스트" : 7,	"계보" : "백언소후의 패",	"무력" : 76,	"지력" : 64,	"통솔력" : 76,	"순발력" : 60,	"행운" : 56,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "수전 보조",	"특성50상세" : "",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "사기 하강 공격",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "80",	},
        {	"이름" : "복양흥",	"병종" : "도사",	"코스트" : 4,	"계보" : "백언소후의 패",	"무력" : 44,	"지력" : 76,	"통솔력" : 69,	"순발력" : 65,	"행운" : 72,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "8",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "책략 피해 반사%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "95",	},
        {	"이름" : "주방",	"병종" : "궁병",	"코스트" : 7,	"계보" : "백언소후의 패",	"무력" : 67,	"지력" : 82,	"통솔력" : 71,	"순발력" : 84,	"행운" : 64,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "중독 공격%",	"특성30상세" : "15",	"특성50" : "혼란 공격%",	"특성50상세" : "15",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "무제한 반격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "교주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "20",	},
        {	"이름" : "제갈근",	"병종" : "풍수사",	"코스트" : 6,	"계보" : "백언소후의 패",	"무력" : 36,	"지력" : 84,	"통솔력" : 75,	"순발력" : 89,	"행운" : 72,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "MP 보조%",	"특성30상세" : "15",	"특성50" : "물리 피해 감소%",	"특성50상세" : "10",	"특성70" : "사신 소환",	"특성70상세" : "",	"특성90" : "주위 견고",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "서주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "51",	},
        {	"이름" : "육항",	"병종" : "도독",	"코스트" : 9,	"계보" : "백언소후의 패",	"무력" : 72,	"지력" : 89,	"통솔력" : 91,	"순발력" : 76,	"행운" : 86,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "MP 공격",	"특성30상세" : "",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "공격 능력 전환",	"특성70상세" : "",	"특성90" : "공격 범위 변경",	"특성90상세" : "몰우전",	"태수효과" : "보관의 달인",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "99",	},
        {	"이름" : "육손",	"병종" : "도독",	"코스트" : 10,	"계보" : "백언소후의 패",	"무력" : 72,	"지력" : 95,	"통솔력" : 94,	"순발력" : 67,	"행운" : 90,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "연환계",	"특성50상세" : "50",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "화계 책략 전문화%",	"특성90상세" : "15",	"태수효과" : "징세의 달인",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "112",	},
        {	"이름" : "마충",	"병종" : "창병",	"코스트" : 5,	"계보" : "벽안자염의 패",	"무력" : 69,	"지력" : 60,	"통솔력" : 71,	"순발력" : 60,	"행운" : 64,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "주위 둔병",	"특성70상세" : "",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "69",	},
        {	"이름" : "공손연",	"병종" : "산악기병",	"코스트" : 4,	"계보" : "벽안자염의 패",	"무력" : 70,	"지력" : 66,	"통솔력" : 65,	"순발력" : 67,	"행운" : 70,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "기마 공격 강화 무시",	"특성30상세" : "",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "돌진 공격%",	"특성70상세" : "3",	"특성90" : "본대 강행",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "135",	},
        {	"이름" : "손화",	"병종" : "궁병",	"코스트" : 4,	"계보" : "벽안자염의 패",	"무력" : 68,	"지력" : 67,	"통솔력" : 55,	"순발력" : 88,	"행운" : 72,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "기마 공격 강화%",	"특성30상세" : "15",	"특성50" : "금격 공격%",	"특성50상세" : "15",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "방어력 하강 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "31",	},
        {	"이름" : "우번",	"병종" : "포차",	"코스트" : 7,	"계보" : "벽안자염의 패",	"무력" : 67,	"지력" : 84,	"통솔력" : 66,	"순발력" : 46,	"행운" : 90,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "공격 명중률 증가",	"특성70상세" : "20",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "92",	},
        {	"이름" : "장온",	"병종" : "책사",	"코스트" : 5,	"계보" : "벽안자염의 패",	"무력" : 26,	"지력" : 79,	"통솔력" : 80,	"순발력" : 73,	"행운" : 74,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "수계 책략 강화%",	"특성50상세" : "15",	"특성70" : "연속 책략 강화",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "기주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "70",	},
        {	"이름" : "낙통",	"병종" : "도독",	"코스트" : 6,	"계보" : "벽안자염의 패",	"무력" : 63,	"지력" : 70,	"통솔력" : 75,	"순발력" : 74,	"행운" : 81,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "정신력 보조%",	"특성50상세" : "9",	"특성70" : "수전 보조",	"특성70상세" : "",	"특성90" : "MP 공격",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "116",	},
        {	"이름" : "여몽",	"병종" : "도독",	"코스트" : 11,	"계보" : "벽안자염의 패",	"무력" : 86,	"지력" : 91,	"통솔력" : 93,	"순발력" : 81,	"행운" : 64,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "수전 보조",	"특성30상세" : "",	"특성50" : "MP 공격",	"특성50상세" : "",	"특성70" : "파진 공격",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "91",	},
        {	"이름" : "장굉",	"병종" : "도사",	"코스트" : 7,	"계보" : "벽안자염의 패",	"무력" : 40,	"지력" : 89,	"통솔력" : 42,	"순발력" : 74,	"행운" : 95,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "MP 방어",	"특성50상세" : "",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "상태이상 반사",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "교주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "34",	},
        {	"이름" : "손호",	"병종" : "노병",	"코스트" : 4,	"계보" : "벽안자염의 패",	"무력" : 28,	"지력" : 31,	"통솔력" : 13,	"순발력" : 16,	"행운" : 3,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "책략 피해 감소%",	"특성30상세" : "10",	"특성50" : "수전 보조",	"특성50상세" : "",	"특성70" : "본대 고양",	"특성70상세" : "",	"특성90" : "방어력 하강 공격",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "74",	},
        {	"이름" : "환계",	"병종" : "창병",	"코스트" : 5,	"계보" : "벽안자염의 패",	"무력" : 32,	"지력" : 78,	"통솔력" : 73,	"순발력" : 66,	"행운" : 70,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "주위 둔병",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "66",	},
        {	"이름" : "당자",	"병종" : "수군",	"코스트" : 6,	"계보" : "벽안자염의 패",	"무력" : 78,	"지력" : 54,	"통솔력" : 68,	"순발력" : 56,	"행운" : 82,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "사기 보조%",	"특성30상세" : "10",	"특성50" : "HP 보조%",	"특성50상세" : "15",	"특성70" : "공격 명중률 증가",	"특성70상세" : "15",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "90",	},
        {	"이름" : "손량",	"병종" : "보병",	"코스트" : 6,	"계보" : "벽안자염의 패",	"무력" : 56,	"지력" : 76,	"통솔력" : 74,	"순발력" : 66,	"행운" : 72,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "사기 보조%",	"특성30상세" : "7",	"특성50" : "책략 방어율 증가",	"특성50상세" : "15",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "49",	},
        {	"이름" : "설종",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "벽안자염의 패",	"무력" : 26,	"지력" : 80,	"통솔력" : 69,	"순발력" : 65,	"행운" : 78,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "15",	"특성50" : "MP 보조%",	"특성50상세" : "13",	"특성70" : "보급계 책략 강화%",	"특성70상세" : "10",	"특성90" : "주위 견고",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "예주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "83",	},
        {	"이름" : "오경",	"병종" : "노병",	"코스트" : 5,	"계보" : "벽안자염의 패",	"무력" : 69,	"지력" : 57,	"통솔력" : 78,	"순발력" : 71,	"행운" : 86,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "회심 공격 강화",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "50",	},
        {	"이름" : "보연사",	"병종" : "노병",	"코스트" : 7,	"계보" : "벽안자염의 패",	"무력" : 64,	"지력" : 76,	"통솔력" : 57,	"순발력" : 85,	"행운" : 89,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "정신력 하강 공격",	"특성30상세" : "",	"특성50" : "금격 공격%",	"특성50상세" : "30",	"특성70" : "일격 필살",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "29",	},
        {	"이름" : "고담",	"병종" : "창병",	"코스트" : 5,	"계보" : "벽안자염의 패",	"무력" : 28,	"지력" : 78,	"통솔력" : 80,	"순발력" : 72,	"행운" : 74,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화%",	"특성30상세" : "15",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "58",	},
        {	"이름" : "손권",	"병종" : "군주",	"코스트" : 9,	"계보" : "벽안자염의 패",	"무력" : 69,	"지력" : 84,	"통솔력" : 79,	"순발력" : 89,	"행운" : 92,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "HP 보조%",	"특성30상세" : "15",	"특성50" : "연속 책략 면역",	"특성50상세" : "",	"특성70" : "일치단결",	"특성70상세" : "",	"특성90" : "주위 견고",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "13",	},
        {	"이름" : "왕수",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "등후사재의 패",	"무력" : 34,	"지력" : 78,	"통솔력" : 70,	"순발력" : 63,	"행운" : 72,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "MP 보조%",	"특성30상세" : "10",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "9",	"특성70" : "주위 각성",	"특성70상세" : "",	"특성90" : "간접 피해 감소%",	"특성90상세" : "20",	"태수효과" : "군량 징세",	"군주효과" : "청주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "93",	},
        {	"이름" : "희지재",	"병종" : "책사",	"코스트" : 6,	"계보" : "등후사재의 패",	"무력" : 26,	"지력" : 86,	"통솔력" : 60,	"순발력" : 70,	"행운" : 91,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "화계 책략 강화%",	"특성50상세" : "15",	"특성70" : "책략 피해 반사%",	"특성70상세" : "10",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "45",	},
        {	"이름" : "왕준",	"병종" : "수군",	"코스트" : 8,	"계보" : "등후사재의 패",	"무력" : 71,	"지력" : 78,	"통솔력" : 83,	"순발력" : 75,	"행운" : 68,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "사기 보조%",	"특성30상세" : "10",	"특성50" : "공격력 보조%",	"특성50상세" : "11",	"특성70" : "공격 명중률 증가",	"특성70상세" : "15",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "사주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "72",	},
        {	"이름" : "조헌",	"병종" : "책사",	"코스트" : 4,	"계보" : "등후사재의 패",	"무력" : 72,	"지력" : 72,	"통솔력" : 65,	"순발력" : 81,	"행운" : 71,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "MP 절약%",	"특성50상세" : "12",	"특성70" : "책략 피해 반사%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "연주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "102",	},
        {	"이름" : "악침",	"병종" : "보병",	"코스트" : 5,	"계보" : "등후사재의 패",	"무력" : 80,	"지력" : 67,	"통솔력" : 81,	"순발력" : 73,	"행운" : 77,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 압박",	"특성50상세" : "",	"특성70" : "책략 피해 반사%",	"특성70상세" : "10",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "양주(북) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "55",	},
        {	"이름" : "장호",	"병종" : "창병",	"코스트" : 7,	"계보" : "등후사재의 패",	"무력" : 76,	"지력" : 44,	"통솔력" : 79,	"순발력" : 65,	"행운" : 78,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "무작위 하강 공격",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "예주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "36",	},
        {	"이름" : "위관",	"병종" : "창병",	"코스트" : 4,	"계보" : "등후사재의 패",	"무력" : 66,	"지력" : 82,	"통솔력" : 72,	"순발력" : 70,	"행운" : 81,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 방해",	"특성30상세" : "",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "기마 공격 강화 무시",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "81",	},
        {	"이름" : "등충",	"병종" : "중기병",	"코스트" : 6,	"계보" : "등후사재의 패",	"무력" : 83,	"지력" : 66,	"통솔력" : 72,	"순발력" : 66,	"행운" : 75,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화 무시",	"특성30상세" : "",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "간접 피해 감소%",	"특성70상세" : "10",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "53",	},
        {	"이름" : "진태",	"병종" : "도독",	"코스트" : 8,	"계보" : "등후사재의 패",	"무력" : 80,	"지력" : 84,	"통솔력" : 90,	"순발력" : 65,	"행운" : 83,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "수전 보조",	"특성30상세" : "",	"특성50" : "일치단결",	"특성50상세" : "",	"특성70" : "MP 공격",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "105",	},
        {	"이름" : "문앙",	"병종" : "경기병",	"코스트" : 11,	"계보" : "등후사재의 패",	"무력" : 93,	"지력" : 67,	"통솔력" : 81,	"순발력" : 88,	"행운" : 56,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "일격 필살",	"특성30상세" : "",	"특성50" : "물리 피해 감소%",	"특성50상세" : "10",	"특성70" : "인도 공격",	"특성70상세" : "",	"특성90" : "피해 범위 변경",	"특성90상세" : "3격",	"태수효과" : "군량 징세",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "16",	},
        {	"이름" : "하후은",	"병종" : "경기병",	"코스트" : 6,	"계보" : "등후사재의 패",	"무력" : 72,	"지력" : 58,	"통솔력" : 63,	"순발력" : 62,	"행운" : 82,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 방해",	"특성30상세" : "",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "사기 보조%",	"특성90상세" : "10",	"태수효과" : "군량 보관",	"군주효과" : "예주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "100",	},
        {	"이름" : "종육",	"병종" : "궁병",	"코스트" : 5,	"계보" : "등후사재의 패",	"무력" : 56,	"지력" : 75,	"통솔력" : 63,	"순발력" : 73,	"행운" : 70,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "중독 공격%",	"특성30상세" : "15",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "공격 명중률 증가",	"특성70상세" : "20",	"특성90" : "공격력 보조%",	"특성90상세" : "15",	"태수효과" : "제재소",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "34",	},
        {	"이름" : "사찬",	"병종" : "창병",	"코스트" : 4,	"계보" : "등후사재의 패",	"무력" : 73,	"지력" : 57,	"통솔력" : 67,	"순발력" : 70,	"행운" : 75,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "주위 둔병",	"특성30상세" : "",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "책략 피해 감소%",	"특성90상세" : "15",	"태수효과" : "은전 보관",	"군주효과" : "사주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "131",	},
        {	"이름" : "문호",	"병종" : "궁기병",	"코스트" : 7,	"계보" : "등후사재의 패",	"무력" : 78,	"지력" : 45,	"통솔력" : 69,	"순발력" : 73,	"행운" : 68,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "흡혈 공격%",	"특성50상세" : "7",	"특성70" : "지원 공격",	"특성70상세" : "",	"특성90" : "피해 범위 변경",	"특성90상세" : "2격",	"태수효과" : "경작",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "78",	},
        {	"이름" : "곽회",	"병종" : "보병",	"코스트" : 9,	"계보" : "등후사재의 패",	"무력" : 78,	"지력" : 82,	"통솔력" : 87,	"순발력" : 56,	"행운" : 86,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "책략 방어율 증가",	"특성30상세" : "20",	"특성50" : "주위 견고",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "병주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "16",	},
        {	"이름" : "호열",	"병종" : "궁기병",	"코스트" : 6,	"계보" : "등후사재의 패",	"무력" : 76,	"지력" : 76,	"통솔력" : 82,	"순발력" : 72,	"행운" : 70,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "지원 공격",	"특성30상세" : "",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "무제한 반격",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "옹주(동) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "94",	},
        {	"이름" : "제갈서",	"병종" : "궁병",	"코스트" : 4,	"계보" : "등후사재의 패",	"무력" : 63,	"지력" : 51,	"통솔력" : 59,	"순발력" : 75,	"행운" : 85,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "중독 공격%",	"특성30상세" : "15",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "순발력 하강 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "37",	},
        {	"이름" : "하후걸",	"병종" : "중기병",	"코스트" : 8,	"계보" : "등후사재의 패",	"무력" : 86,	"지력" : 50,	"통솔력" : 73,	"순발력" : 80,	"행운" : 82,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 반사%",	"특성70상세" : "12",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "예주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "31",	},
        {	"이름" : "종요",	"병종" : "풍수사",	"코스트" : 7,	"계보" : "등후사재의 패",	"무력" : 34,	"지력" : 90,	"통솔력" : 82,	"순발력" : 69,	"행운" : 82,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "15",	"특성50" : "연속 공격 면역",	"특성50상세" : "",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "예주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "32",	},
        {	"이름" : "학소",	"병종" : "보병",	"코스트" : 9,	"계보" : "등후사재의 패",	"무력" : 76,	"지력" : 82,	"통솔력" : 89,	"순발력" : 65,	"행운" : 90,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "전 방어율 증가",	"특성30상세" : "7",	"특성50" : "특수 공격 면역",	"특성50상세" : "",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "14",	},
        {	"이름" : "등애",	"병종" : "산악기병",	"코스트" : 11,	"계보" : "등후사재의 패",	"무력" : 87,	"지력" : 89,	"통솔력" : 93,	"순발력" : 81,	"행운" : 72,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "기습 공격%",	"특성30상세" : "4",	"특성50" : "돌파 공격",	"특성50상세" : "",	"특성70" : "특수 공격 면역",	"특성70상세" : "",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "21",	},
        {	"이름" : "조통",	"병종" : "보병",	"코스트" : 6,	"계보" : "상산자룡의 패",	"무력" : 68,	"지력" : 65,	"통솔력" : 65,	"순발력" : 72,	"행운" : 85,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "선제 공격",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "익주(북) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "63",	},
        {	"이름" : "조광",	"병종" : "전차",	"코스트" : 6,	"계보" : "상산자룡의 패",	"무력" : 70,	"지력" : 58,	"통솔력" : 72,	"순발력" : 71,	"행운" : 83,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "순발력 보조%",	"특성30상세" : "7",	"특성50" : "돌진 공격%",	"특성50상세" : "3",	"특성70" : "방어력 보조",	"특성70상세" : "30",	"특성90" : "선제 공격",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "117",	},
        {	"이름" : "전해",	"병종" : "중기병",	"코스트" : 4,	"계보" : "상산자룡의 패",	"무력" : 74,	"지력" : 70,	"통솔력" : 79,	"순발력" : 68,	"행운" : 77,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "맹독 공격%",	"특성90상세" : "50",	"태수효과" : "항만",	"군주효과" : "청주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "72",	},
        {	"이름" : "전예",	"병종" : "경기병",	"코스트" : 9,	"계보" : "상산자룡의 패",	"무력" : 72,	"지력" : 82,	"통솔력" : 85,	"순발력" : 76,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "연속 공격 강화%",	"특성90상세" : "15",	"태수효과" : "시장",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "55",	},
        {	"이름" : "엄강",	"병종" : "산악기병",	"코스트" : 5,	"계보" : "상산자룡의 패",	"무력" : 76,	"지력" : 45,	"통솔력" : 69,	"순발력" : 73,	"행운" : 46,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "전화위복",	"특성30상세" : "",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "주위 압박",	"특성70상세" : "",	"특성90" : "회심 공격 강화",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "109",	},
        {	"이름" : "관정",	"병종" : "책사",	"코스트" : 4,	"계보" : "상산자룡의 패",	"무력" : 36,	"지력" : 79,	"통솔력" : 66,	"순발력" : 63,	"행운" : 60,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "주위 강행",	"특성50상세" : "",	"특성70" : "책략 피해 반사%",	"특성70상세" : "10",	"특성90" : "원소 책략 강화%",	"특성90상세" : "15",	"태수효과" : "징세의 달인",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "86",	},
        {	"이름" : "부첨",	"병종" : "창병",	"코스트" : 9,	"계보" : "상산자룡의 패",	"무력" : 84,	"지력" : 72,	"통솔력" : 77,	"순발력" : 64,	"행운" : 83,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 관통",	"특성30상세" : "10",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "방어력 보조%",	"특성70상세" : "10",	"특성90" : "공격 범위 변경",	"특성90상세" : "몰우전",	"태수효과" : "시장",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "43",	},
        {	"이름" : "윤묵",	"병종" : "풍수사",	"코스트" : 6,	"계보" : "상산자룡의 패",	"무력" : 26,	"지력" : 86,	"통솔력" : 67,	"순발력" : 62,	"행운" : 90,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "주위 각성",	"특성30상세" : "",	"특성50" : "상태이상 반사",	"특성50상세" : "",	"특성70" : "보급계 책략 강화%",	"특성70상세" : "10",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "49",	},
        {	"이름" : "장억",	"병종" : "무인",	"코스트" : 8,	"계보" : "상산자룡의 패",	"무력" : 77,	"지력" : 54,	"통솔력" : 81,	"순발력" : 89,	"행운" : 68,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "책략 피해 감소%",	"특성30상세" : "10",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "본대 연병",	"특성70상세" : "",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "63",	},
        {	"이름" : "이명",	"병종" : "호술사",	"코스트" : 7,	"계보" : "상산자룡의 패",	"무력" : 72,	"지력" : 51,	"통솔력" : 66,	"순발력" : 83,	"행운" : 47,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "방어력 보조%",	"특성30상세" : "10",	"특성50" : "혼란 공격%",	"특성50상세" : "30",	"특성70" : "회심 공격 면역",	"특성70상세" : "",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "85",	},
        {	"이름" : "미방",	"병종" : "보병",	"코스트" : 4,	"계보" : "상산자룡의 패",	"무력" : 62,	"지력" : 33,	"통솔력" : 56,	"순발력" : 65,	"행운" : 84,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 방해",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "96",	},
        {	"이름" : "극정",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "상산자룡의 패",	"무력" : 26,	"지력" : 76,	"통솔력" : 66,	"순발력" : 66,	"행운" : 71,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "15",	"특성50" : "MP 보조%",	"특성50상세" : "13",	"특성70" : "보급계 책략 강화%",	"특성70상세" : "10",	"특성90" : "주위 연병",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "사주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "96",	},
        {	"이름" : "유도",	"병종" : "보병",	"코스트" : 4,	"계보" : "상산자룡의 패",	"무력" : 44,	"지력" : 46,	"통솔력" : 38,	"순발력" : 67,	"행운" : 79,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 허탈",	"특성50상세" : "",	"특성70" : "공격 방어율 증가",	"특성70상세" : "20",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(남) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "101",	},
        {	"이름" : "영수",	"병종" : "책사",	"코스트" : 4,	"계보" : "상산자룡의 패",	"무력" : 68,	"지력" : 78,	"통솔력" : 75,	"순발력" : 68,	"행운" : 74,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "주위 기합",	"특성50상세" : "",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "지계 책략 강화%",	"특성90상세" : "20",	"태수효과" : "절대 보호",	"군주효과" : "익주(북) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "89",	},
        {	"이름" : "공손월",	"병종" : "산악기병",	"코스트" : 6,	"계보" : "상산자룡의 패",	"무력" : 72,	"지력" : 47,	"통솔력" : 74,	"순발력" : 79,	"행운" : 56,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "기마 공격 강화%",	"특성30상세" : "10",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "기마 공격 강화 무시",	"특성70상세" : "",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "101",	},
        {	"이름" : "번건",	"병종" : "포차",	"코스트" : 4,	"계보" : "상산자룡의 패",	"무력" : 56,	"지력" : 73,	"통솔력" : 61,	"순발력" : 47,	"행운" : 74,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "공격 명중률 증가",	"특성50상세" : "17",	"특성70" : "본대 연병",	"특성70상세" : "",	"특성90" : "공격력 하강 공격",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "149",	},
        {	"이름" : "하후란",	"병종" : "경기병",	"코스트" : 4,	"계보" : "상산자룡의 패",	"무력" : 76,	"지력" : 67,	"통솔력" : 73,	"순발력" : 77,	"행운" : 71,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "주위 방해",	"특성70상세" : "",	"특성90" : "회심 공격 강화",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "122",	},
        {	"이름" : "마량",	"병종" : "책사",	"코스트" : 7,	"계보" : "상산자룡의 패",	"무력" : 58,	"지력" : 89,	"통솔력" : 66,	"순발력" : 60,	"행운" : 79,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 모방",	"특성30상세" : "",	"특성50" : "주위 집중",	"특성50상세" : "",	"특성70" : "홍련탄 강화%",	"특성70상세" : "20",	"특성90" : "회심 공격 면역",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "형주(남) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "37",	},
        {	"이름" : "나헌",	"병종" : "보병",	"코스트" : 9,	"계보" : "상산자룡의 패",	"무력" : 74,	"지력" : 82,	"통솔력" : 87,	"순발력" : 74,	"행운" : 65,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "17",	},
        {	"이름" : "공손찬",	"병종" : "산악기병",	"코스트" : 9,	"계보" : "상산자룡의 패",	"무력" : 86,	"지력" : 66,	"통솔력" : 85,	"순발력" : 72,	"행운" : 70,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "금격 공격%",	"특성30상세" : "15",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "파진 공격",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "39",	},
        {	"이름" : "조운",	"병종" : "산악기병",	"코스트" : 13,	"계보" : "상산자룡의 패",	"무력" : 96,	"지력" : 77,	"통솔력" : 92,	"순발력" : 97,	"행운" : 72,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "30",	"특성50" : "일기당천",	"특성50상세" : "",	"특성70" : "선제 공격",	"특성70상세" : "",	"특성90" : "조가창술",	"특성90상세" : "60",	"태수효과" : "보관의 달인",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "6",	},
        {	"이름" : "사섭",	"병종" : "포차",	"코스트" : 7,	"계보" : "영웅문대의 패",	"무력" : 58,	"지력" : 80,	"통솔력" : 62,	"순발력" : 52,	"행운" : 92,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "무작위 하강 공격",	"특성30상세" : "",	"특성50" : "공격 명중률 증가",	"특성50상세" : "17",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "본대 고양",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "교주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "107",	},
        {	"이름" : "장휴",	"병종" : "궁병",	"코스트" : 6,	"계보" : "영웅문대의 패",	"무력" : 56,	"지력" : 76,	"통솔력" : 78,	"순발력" : 73,	"행운" : 66,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "본대 연병",	"특성30상세" : "",	"특성50" : "사기 보조%",	"특성50상세" : "10",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "공격력 하강 공격",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "28",	},
        {	"이름" : "손정",	"병종" : "중기병",	"코스트" : 5,	"계보" : "영웅문대의 패",	"무력" : 58,	"지력" : 74,	"통솔력" : 69,	"순발력" : 72,	"행운" : 72,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화 무시",	"특성30상세" : "",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "맹독 공격%",	"특성90상세" : "50",	"태수효과" : "공방",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "71",	},
        {	"이름" : "원유",	"병종" : "궁병",	"코스트" : 5,	"계보" : "영웅문대의 패",	"무력" : 66,	"지력" : 77,	"통솔력" : 69,	"순발력" : 70,	"행운" : 63,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "부동 공격%",	"특성50상세" : "15",	"특성70" : "중독 공격%",	"특성70상세" : "15",	"특성90" : "공격력 하강 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "교주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "35",	},
        {	"이름" : "손유",	"병종" : "수군",	"코스트" : 8,	"계보" : "영웅문대의 패",	"무력" : 73,	"지력" : 72,	"통솔력" : 80,	"순발력" : 83,	"행운" : 70,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "수계 책략 강화%",	"특성30상세" : "7",	"특성50" : "공격 명중률 증가",	"특성50상세" : "15",	"특성70" : "방어력 보조%",	"특성70상세" : "13",	"특성90" : "금격 공격%",	"특성90상세" : "20",	"태수효과" : "제재소",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "69",	},
        {	"이름" : "심영",	"병종" : "창병",	"코스트" : 9,	"계보" : "영웅문대의 패",	"무력" : 87,	"지력" : 64,	"통솔력" : 80,	"순발력" : 74,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "주위 둔병",	"특성30상세" : "",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "기주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "38",	},
        {	"이름" : "정보",	"병종" : "중기병",	"코스트" : 9,	"계보" : "영웅문대의 패",	"무력" : 79,	"지력" : 79,	"통솔력" : 84,	"순발력" : 58,	"행운" : 93,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "HP 보조%",	"특성90상세" : "15",	"태수효과" : "견직",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "20",	},
        {	"이름" : "황개",	"병종" : "무인",	"코스트" : 10,	"계보" : "영웅문대의 패",	"무력" : 89,	"지력" : 70,	"통솔력" : 80,	"순발력" : 90,	"행운" : 54,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "책략 피해 감소%",	"특성30상세" : "15",	"특성50" : "고육지계",	"특성50상세" : "10",	"특성70" : "권토중래",	"특성70상세" : "",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "29",	},
        {	"이름" : "사일",	"병종" : "노병",	"코스트" : 4,	"계보" : "영웅문대의 패",	"무력" : 64,	"지력" : 74,	"통솔력" : 69,	"순발력" : 52,	"행운" : 78,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "책략 피해 감소%",	"특성30상세" : "10",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "본대 고양",	"특성70상세" : "",	"특성90" : "회심 공격 강화",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "교주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "67",	},
        {	"이름" : "장양",	"병종" : "경기병",	"코스트" : 6,	"계보" : "영웅문대의 패",	"무력" : 78,	"지력" : 68,	"통솔력" : 73,	"순발력" : 69,	"행운" : 54,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "기마 공격 강화%",	"특성90상세" : "15",	"태수효과" : "보관의 달인",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "91",	},
        {	"이름" : "손익",	"병종" : "수군",	"코스트" : 7,	"계보" : "영웅문대의 패",	"무력" : 79,	"지력" : 26,	"통솔력" : 74,	"순발력" : 87,	"행운" : 56,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "사기 보조%",	"특성30상세" : "10",	"특성50" : "공격 명중률 증가",	"특성50상세" : "15",	"특성70" : "수계 책략 강화%",	"특성70상세" : "9",	"특성90" : "금책 공격%",	"특성90상세" : "20",	"태수효과" : "군량 보관",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "76",	},
        {	"이름" : "주치",	"병종" : "노병",	"코스트" : 7,	"계보" : "영웅문대의 패",	"무력" : 66,	"지력" : 74,	"통솔력" : 81,	"순발력" : 74,	"행운" : 74,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "정신력 하강 공격",	"특성30상세" : "",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "공격력 보조%",	"특성90상세" : "15",	"태수효과" : "수산물",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "39",	},
        {	"이름" : "조무",	"병종" : "적병",	"코스트" : 8,	"계보" : "영웅문대의 패",	"무력" : 82,	"지력" : 62,	"통솔력" : 75,	"순발력" : 90,	"행운" : 60,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "주위 허탈",	"특성30상세" : "",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "지계 책략 강화%",	"특성70상세" : "10",	"특성90" : "일기당천",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "44",	},
        {	"이름" : "한당",	"병종" : "적병",	"코스트" : 9,	"계보" : "영웅문대의 패",	"무력" : 85,	"지력" : 60,	"통솔력" : 76,	"순발력" : 64,	"행운" : 82,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "방어력 보조%",	"특성30상세" : "10",	"특성50" : "수전 보조",	"특성50상세" : "",	"특성70" : "연속 반격",	"특성70상세" : "",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "21",	},
        {	"이름" : "여대",	"병종" : "도독",	"코스트" : 8,	"계보" : "영웅문대의 패",	"무력" : 77,	"지력" : 78,	"통솔력" : 88,	"순발력" : 85,	"행운" : 72,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "흡혈 공격%",	"특성30상세" : "7",	"특성50" : "공격 방어율 증가",	"특성50상세" : "17",	"특성70" : "주위 고양",	"특성70상세" : "",	"특성90" : "MP 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "교주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "107",	},
        {	"이름" : "손상향",	"병종" : "궁기병",	"코스트" : 11,	"계보" : "영웅문대의 패",	"무력" : 85,	"지력" : 68,	"통솔력" : 79,	"순발력" : 96,	"행운" : 78,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "근거리 궁술",	"특성30상세" : "",	"특성50" : "돌파 공격",	"특성50상세" : "",	"특성70" : "주동 공격",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "23",	},
        {	"이름" : "손견",	"병종" : "군주",	"코스트" : 10,	"계보" : "영웅문대의 패",	"무력" : 90,	"지력" : 79,	"통솔력" : 94,	"순발력" : 77,	"행운" : 89,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "주위 견고",	"특성50상세" : "",	"특성70" : "방어력 하강 공격",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "8",	},
        {	"이름" : "주흔",	"병종" : "적병",	"코스트" : 6,	"계보" : "봉추사원의 패",	"무력" : 73,	"지력" : 76,	"통솔력" : 74,	"순발력" : 68,	"행운" : 78,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "공격력 보조%",	"특성30상세" : "10",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "주위 허탈",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "47",	},
        {	"이름" : "향랑",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "봉추사원의 패",	"무력" : 26,	"지력" : 77,	"통솔력" : 66,	"순발력" : 71,	"행운" : 71,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "MP 보조%",	"특성30상세" : "10",	"특성50" : "MP 보조%",	"특성50상세" : "13",	"특성70" : "보급계 책략 강화%",	"특성70상세" : "10",	"특성90" : "주위 집중",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "형주(남) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "94",	},
        {	"이름" : "금선",	"병종" : "포차",	"코스트" : 4,	"계보" : "봉추사원의 패",	"무력" : 72,	"지력" : 16,	"통솔력" : 58,	"순발력" : 55,	"행운" : 61,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "물리 필중",	"특성30상세" : "",	"특성50" : "책략 피해 감소%",	"특성50상세" : "15",	"특성70" : "본대 연병",	"특성70상세" : "",	"특성90" : "중독 공격%",	"특성90상세" : "20",	"태수효과" : "시장",	"군주효과" : "형주(남) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "132",	},
        {	"이름" : "당희",	"병종" : "무희",	"코스트" : 7,	"계보" : "봉추사원의 패",	"무력" : 62,	"지력" : 71,	"통솔력" : 56,	"순발력" : 91,	"행운" : 62,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "주위 고양",	"특성30상세" : "",	"특성50" : "책략 모방",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "흡혈 공격%",	"특성90상세" : "8",	"태수효과" : "과수",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "15",	},
        {	"이름" : "괴량",	"병종" : "책사",	"코스트" : 7,	"계보" : "봉추사원의 패",	"무력" : 44,	"지력" : 88,	"통솔력" : 74,	"순발력" : 66,	"행운" : 78,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "원소 책략 강화%",	"특성30상세" : "5",	"특성50" : "지계 책략 강화%",	"특성50상세" : "15",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "38",	},
        {	"이름" : "손건",	"병종" : "풍수사",	"코스트" : 5,	"계보" : "봉추사원의 패",	"무력" : 66,	"지력" : 82,	"통솔력" : 76,	"순발력" : 62,	"행운" : 92,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "8",	"특성50" : "연속 공격 면역",	"특성50상세" : "",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "66",	},
        {	"이름" : "괴월",	"병종" : "도사",	"코스트" : 6,	"계보" : "봉추사원의 패",	"무력" : 40,	"지력" : 83,	"통솔력" : 76,	"순발력" : 80,	"행운" : 71,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "주위 방해",	"특성50상세" : "",	"특성70" : "방해계 책략 강화%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "형주(남) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "52",	},
        {	"이름" : "유표",	"병종" : "군주",	"코스트" : 7,	"계보" : "봉추사원의 패",	"무력" : 68,	"지력" : 83,	"통솔력" : 72,	"순발력" : 67,	"행운" : 85,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "주위 견고",	"특성50상세" : "",	"특성70" : "순발력 보조%",	"특성70상세" : "10",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "청주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "31",	},
        {	"이름" : "호주천",	"병종" : "산악기병",	"코스트" : 6,	"계보" : "봉추사원의 패",	"무력" : 70,	"지력" : 36,	"통솔력" : 72,	"순발력" : 83,	"행운" : 62,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "돌진 공격%",	"특성30상세" : "2",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "일기당천",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "105",	},
        {	"이름" : "초촉",	"병종" : "적병",	"코스트" : 7,	"계보" : "봉추사원의 패",	"무력" : 79,	"지력" : 33,	"통솔력" : 68,	"순발력" : 55,	"행운" : 82,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "지계 책략 강화%",	"특성30상세" : "10",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "공격 방어율 증가",	"특성70상세" : "20",	"특성90" : "공격 범위 변경",	"특성90상세" : "몰우전",	"태수효과" : "시장",	"군주효과" : "병주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "32",	},
        {	"이름" : "왕찬",	"병종" : "노병",	"코스트" : 5,	"계보" : "봉추사원의 패",	"무력" : 61,	"지력" : 85,	"통솔력" : 68,	"순발력" : 57,	"행운" : 68,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "본대 고양",	"특성30상세" : "",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "연주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "66",	},
        {	"이름" : "유기",	"병종" : "보병",	"코스트" : 4,	"계보" : "봉추사원의 패",	"무력" : 36,	"지력" : 67,	"통솔력" : 59,	"순발력" : 66,	"행운" : 74,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "전 방어율 증가",	"특성30상세" : "7",	"특성50" : "주위 압박",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "분노 축적%",	"특성90상세" : "20",	"태수효과" : "군량 징세",	"군주효과" : "형주(북) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "93",	},
        {	"이름" : "답돈",	"병종" : "산악기병",	"코스트" : 8,	"계보" : "봉추사원의 패",	"무력" : 82,	"지력" : 60,	"통솔력" : 84,	"순발력" : 58,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "10",	"특성50" : "기마 공격 강화 무시",	"특성50상세" : "",	"특성70" : "돌진 공격%",	"특성70상세" : "3",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "58",	},
        {	"이름" : "미축",	"병종" : "책사",	"코스트" : 5,	"계보" : "봉추사원의 패",	"무력" : 65,	"지력" : 81,	"통솔력" : 76,	"순발력" : 77,	"행운" : 83,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "연속 공격 면역",	"특성50상세" : "",	"특성70" : "연속 책략 강화",	"특성70상세" : "",	"특성90" : "상태이상 반사",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "67",	},
        {	"이름" : "기령",	"병종" : "중기병",	"코스트" : 8,	"계보" : "봉추사원의 패",	"무력" : 83,	"지력" : 51,	"통솔력" : 78,	"순발력" : 72,	"행운" : 67,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 반사%",	"특성70상세" : "12",	"특성90" : "천하무쌍%",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(북) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "30",	},
        {	"이름" : "노식",	"병종" : "보병",	"코스트" : 8,	"계보" : "봉추사원의 패",	"무력" : 54,	"지력" : 82,	"통솔력" : 88,	"순발력" : 77,	"행운" : 88,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 압박",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "22",	},
        {	"이름" : "방통",	"병종" : "현자",	"코스트" : 10,	"계보" : "봉추사원의 패",	"무력" : 77,	"지력" : 97,	"통솔력" : 89,	"순발력" : 68,	"행운" : 85,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "주위 집중",	"특성30상세" : "",	"특성50" : "화계 책략 전문화%",	"특성50상세" : "15",	"특성70" : "연속 책략",	"특성70상세" : "",	"특성90" : "연환계",	"특성90상세" : "50",	"태수효과" : "군량 징세",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "8",	},
        {	"이름" : "엄백호",	"병종" : "적병",	"코스트" : 4,	"계보" : "단명백부의 패",	"무력" : 70,	"지력" : 23,	"통솔력" : 67,	"순발력" : 55,	"행운" : 83,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "전화위복",	"특성30상세" : "",	"특성50" : "본대 강행",	"특성50상세" : "",	"특성70" : "공격력 보조%",	"특성70상세" : "13",	"특성90" : "피해 범위 변경",	"특성90상세" : "2격",	"태수효과" : "군량 징세",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "63",	},
        {	"이름" : "허공",	"병종" : "도사",	"코스트" : 4,	"계보" : "단명백부의 패",	"무력" : 52,	"지력" : 68,	"통솔력" : 67,	"순발력" : 44,	"행운" : 73,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "8",	"특성50" : "주위 둔병",	"특성50상세" : "",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "109",	},
        {	"이름" : "엄여",	"병종" : "산악기병",	"코스트" : 6,	"계보" : "단명백부의 패",	"무력" : 75,	"지력" : 19,	"통솔력" : 62,	"순발력" : 76,	"행운" : 67,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "금격 공격%",	"특성30상세" : "15",	"특성50" : "본대 강행",	"특성50상세" : "",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "97",	},
        {	"이름" : "유요",	"병종" : "중기병",	"코스트" : 6,	"계보" : "단명백부의 패",	"무력" : 72,	"지력" : 72,	"통솔력" : 69,	"순발력" : 50,	"행운" : 77,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "본대 견고",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "청주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "59",	},
        {	"이름" : "오찬",	"병종" : "적병",	"코스트" : 5,	"계보" : "단명백부의 패",	"무력" : 68,	"지력" : 78,	"통솔력" : 66,	"순발력" : 65,	"행운" : 87,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "지계 책략 강화%",	"특성30상세" : "10",	"특성50" : "수전 보조",	"특성50상세" : "",	"특성70" : "공격력 보조%",	"특성70상세" : "13",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "48",	},
        {	"이름" : "전종",	"병종" : "노병",	"코스트" : 8,	"계보" : "단명백부의 패",	"무력" : 72,	"지력" : 75,	"통솔력" : 78,	"순발력" : 69,	"행운" : 90,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "책략 피해 감소%",	"특성30상세" : "10",	"특성50" : "혼란 공격%",	"특성50상세" : "15",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "정신력 하강 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "양주(북) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "22",	},
        {	"이름" : "서성",	"병종" : "궁병",	"코스트" : 9,	"계보" : "단명백부의 패",	"무력" : 83,	"지력" : 80,	"통솔력" : 86,	"순발력" : 65,	"행운" : 84,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "책략 피해 감소%",	"특성30상세" : "15",	"특성50" : "수전 보조",	"특성50상세" : "",	"특성70" : "금책 공격%",	"특성70상세" : "30",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "19",	},
        {	"이름" : "손소",	"병종" : "무인",	"코스트" : 9,	"계보" : "단명백부의 패",	"무력" : 78,	"지력" : 73,	"통솔력" : 83,	"순발력" : 81,	"행운" : 70,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "방해계 책략 강화%",	"특성70상세" : "10",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "52",	},
        {	"이름" : "주환",	"병종" : "노병",	"코스트" : 9,	"계보" : "단명백부의 패",	"무력" : 84,	"지력" : 77,	"통솔력" : 86,	"순발력" : 66,	"행운" : 75,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "정신력 하강 공격",	"특성30상세" : "",	"특성50" : "관통 사격",	"특성50상세" : "",	"특성70" : "피해 범위 변경",	"특성70상세" : "2격",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "25",	},
        {	"이름" : "대교",	"병종" : "무희",	"코스트" : 9,	"계보" : "단명백부의 패",	"무력" : 69,	"지력" : 80,	"통솔력" : 62,	"순발력" : 97,	"행운" : 86,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "유혹 책략 강화%",	"특성30상세" : "120",	"특성50" : "연속 책략",	"특성50상세" : "",	"특성70" : "운기조식",	"특성70상세" : "",	"특성90" : "전 방어율 증가",	"특성90상세" : "7",	"태수효과" : "보관의 달인",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "8",	},
        {	"이름" : "능조",	"병종" : "수군",	"코스트" : 9,	"계보" : "단명백부의 패",	"무력" : 84,	"지력" : 42,	"통솔력" : 79,	"순발력" : 87,	"행운" : 59,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "사기 보조%",	"특성30상세" : "10",	"특성50" : "공격 명중률 증가",	"특성50상세" : "15",	"특성70" : "방어력 보조%",	"특성70상세" : "13",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "청주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "42",	},
        {	"이름" : "진횡",	"병종" : "수군",	"코스트" : 4,	"계보" : "단명백부의 패",	"무력" : 69,	"지력" : 28,	"통솔력" : 67,	"순발력" : 71,	"행운" : 55,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "사기 보조%",	"특성30상세" : "10",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "공격 명중률 증가",	"특성70상세" : "15",	"특성90" : "책략 방어율 증가",	"특성90상세" : "20",	"태수효과" : "과수",	"군주효과" : "양주(북) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "136",	},
        {	"이름" : "제갈교",	"병종" : "노병",	"코스트" : 6,	"계보" : "단명백부의 패",	"무력" : 56,	"지력" : 76,	"통솔력" : 80,	"순발력" : 65,	"행운" : 72,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "책략 피해 감소%",	"특성30상세" : "10",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "주위 고양",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "54",	},
        {	"이름" : "동습",	"병종" : "보병",	"코스트" : 8,	"계보" : "단명백부의 패",	"무력" : 85,	"지력" : 65,	"통솔력" : 72,	"순발력" : 73,	"행운" : 68,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "수전 보조",	"특성30상세" : "",	"특성50" : "주위 방해",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "HP 보조%",	"특성90상세" : "15",	"태수효과" : "군량 보관",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "33",	},
        {	"이름" : "여범",	"병종" : "도독",	"코스트" : 6,	"계보" : "단명백부의 패",	"무력" : 62,	"지력" : 78,	"통솔력" : 79,	"순발력" : 72,	"행운" : 77,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "원소 책략 강화%",	"특성30상세" : "5",	"특성50" : "책략 방어율 증가",	"특성50상세" : "15",	"특성70" : "주위 고양",	"특성70상세" : "",	"특성90" : "MP 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "교주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "114",	},
        {	"이름" : "손환",	"병종" : "보병",	"코스트" : 8,	"계보" : "단명백부의 패",	"무력" : 77,	"지력" : 77,	"통솔력" : 79,	"순발력" : 68,	"행운" : 80,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "수전 보조",	"특성30상세" : "",	"특성50" : "분노 축적%",	"특성50상세" : "20",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "29",	},
        {	"이름" : "손교",	"병종" : "도독",	"코스트" : 6,	"계보" : "단명백부의 패",	"무력" : 68,	"지력" : 75,	"통솔력" : 82,	"순발력" : 87,	"행운" : 65,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "주위 고양",	"특성30상세" : "",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "MP 공격",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "113",	},
        {	"이름" : "정봉",	"병종" : "궁병",	"코스트" : 9,	"계보" : "단명백부의 패",	"무력" : 80,	"지력" : 75,	"통솔력" : 81,	"순발력" : 90,	"행운" : 67,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "근거리 궁술",	"특성30상세" : "",	"특성50" : "연속 공격 면역",	"특성50상세" : "",	"특성70" : "인도 공격",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "교주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "12",	},
        {	"이름" : "장흠",	"병종" : "수군",	"코스트" : 10,	"계보" : "단명백부의 패",	"무력" : 86,	"지력" : 57,	"통솔력" : 79,	"순발력" : 91,	"행운" : 66,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "10",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "공격 명중률 증가",	"특성70상세" : "15",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "32",	},
        {	"이름" : "장소",	"병종" : "책사",	"코스트" : 8,	"계보" : "단명백부의 패",	"무력" : 43,	"지력" : 91,	"통솔력" : 66,	"순발력" : 72,	"행운" : 86,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "수계 책략 전문화%",	"특성30상세" : "20",	"특성50" : "책략 명중률 증가",	"특성50상세" : "15",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "전 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "27",	},
        {	"이름" : "손책",	"병종" : "군주",	"코스트" : 11,	"계보" : "단명백부의 패",	"무력" : 93,	"지력" : 74,	"통솔력" : 96,	"순발력" : 92,	"행운" : 67,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "주위 기합",	"특성70상세" : "",	"특성90" : "소패왕",	"특성90상세" : "3",	"태수효과" : "은전 징세",	"군주효과" : "전 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "17",	},
        {	"이름" : "허정",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "미주공근의 패",	"무력" : 55,	"지력" : 78,	"통솔력" : 74,	"순발력" : 68,	"행운" : 77,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "주위 각성",	"특성30상세" : "",	"특성50" : "MP 보조%",	"특성50상세" : "13",	"특성70" : "보급계 책략 강화%",	"특성70상세" : "10",	"특성90" : "간접 피해 감소%",	"특성90상세" : "20",	"태수효과" : "수산물",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "91",	},
        {	"이름" : "손준",	"병종" : "중기병",	"코스트" : 6,	"계보" : "미주공근의 패",	"무력" : 80,	"지력" : 68,	"통솔력" : 72,	"순발력" : 58,	"행운" : 74,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "기마 공격 강화 무시",	"특성70상세" : "",	"특성90" : "HP 보조%",	"특성90상세" : "15",	"태수효과" : "과수",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "54",	},
        {	"이름" : "오언",	"병종" : "경기병",	"코스트" : 7,	"계보" : "미주공근의 패",	"무력" : 72,	"지력" : 76,	"통솔력" : 73,	"순발력" : 61,	"행운" : 72,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "연속 공격 강화%",	"특성70상세" : "15",	"특성90" : "반격 강화",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "84",	},
        {	"이름" : "황조",	"병종" : "무인",	"코스트" : 7,	"계보" : "미주공근의 패",	"무력" : 69,	"지력" : 58,	"통솔력" : 78,	"순발력" : 82,	"행운" : 75,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "8",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "반격 강화",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "형주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "87",	},
        {	"이름" : "손노육",	"병종" : "책사",	"코스트" : 6,	"계보" : "미주공근의 패",	"무력" : 69,	"지력" : 86,	"통솔력" : 84,	"순발력" : 56,	"행운" : 71,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "사신 소환",	"특성30상세" : "",	"특성50" : "수계 책략 강화%",	"특성50상세" : "15",	"특성70" : "책략 피해 반사%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "48",	},
        {	"이름" : "보즐",	"병종" : "도사",	"코스트" : 5,	"계보" : "미주공근의 패",	"무력" : 60,	"지력" : 84,	"통솔력" : 83,	"순발력" : 76,	"행운" : 61,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "상태이상 반사",	"특성30상세" : "",	"특성50" : "주위 방해",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "62",	},
        {	"이름" : "담웅",	"병종" : "궁기병",	"코스트" : 6,	"계보" : "미주공근의 패",	"무력" : 77,	"지력" : 39,	"통솔력" : 64,	"순발력" : 72,	"행운" : 82,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화%",	"특성30상세" : "15",	"특성50" : "반격 강화",	"특성50상세" : "",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "사기 하강 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "93",	},
        {	"이름" : "손휴",	"병종" : "보병",	"코스트" : 5,	"계보" : "미주공근의 패",	"무력" : 50,	"지력" : 81,	"통솔력" : 67,	"순발력" : 63,	"행운" : 88,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "사기 보조%",	"특성30상세" : "7",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "교주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "76",	},
        {	"이름" : "주연",	"병종" : "도독",	"코스트" : 7,	"계보" : "미주공근의 패",	"무력" : 74,	"지력" : 75,	"통솔력" : 91,	"순발력" : 78,	"행운" : 92,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "수전 보조",	"특성30상세" : "",	"특성50" : "일격 필살",	"특성50상세" : "",	"특성70" : "돌파 공격",	"특성70상세" : "",	"특성90" : "MP 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "108",	},
        {	"이름" : "소교",	"병종" : "풍수사",	"코스트" : 8,	"계보" : "미주공근의 패",	"무력" : 34,	"지력" : 86,	"통솔력" : 66,	"순발력" : 81,	"행운" : 92,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "10",	"특성50" : "책략 모방",	"특성50상세" : "",	"특성70" : "주위 강행",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "29",	},
        {	"이름" : "왕랑",	"병종" : "책사",	"코스트" : 5,	"계보" : "미주공근의 패",	"무력" : 42,	"지력" : 84,	"통솔력" : 62,	"순발력" : 62,	"행운" : 73,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "원소 책략 강화%",	"특성30상세" : "5",	"특성50" : "책략 명중률 증가",	"특성50상세" : "12",	"특성70" : "연속 책략 강화",	"특성70상세" : "",	"특성90" : "주위 집중",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "61",	},
        {	"이름" : "소비",	"병종" : "수군",	"코스트" : 6,	"계보" : "미주공근의 패",	"무력" : 71,	"지력" : 66,	"통솔력" : 73,	"순발력" : 78,	"행운" : 65,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "사기 보조%",	"특성30상세" : "10",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "공격 명중률 증가",	"특성70상세" : "15",	"특성90" : "연속 책략 면역",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "형주(남) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "102",	},
        {	"이름" : "화흠",	"병종" : "도사",	"코스트" : 4,	"계보" : "미주공근의 패",	"무력" : 42,	"지력" : 84,	"통솔력" : 26,	"순발력" : 46,	"행운" : 56,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "물리 피해 감소%",	"특성50상세" : "10",	"특성70" : "방해계 책략 강화%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "75",	},
        {	"이름" : "하제",	"병종" : "중기병",	"코스트" : 8,	"계보" : "미주공근의 패",	"무력" : 80,	"지력" : 72,	"통솔력" : 79,	"순발력" : 68,	"행운" : 74,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "기마 공격 강화 무시",	"특성70상세" : "",	"특성90" : "회심 공격 면역",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "교주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "28",	},
        {	"이름" : "감택",	"병종" : "포차",	"코스트" : 6,	"계보" : "미주공근의 패",	"무력" : 56,	"지력" : 83,	"통솔력" : 72,	"순발력" : 78,	"행운" : 67,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "청주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "120",	},
        {	"이름" : "반장",	"병종" : "창병",	"코스트" : 8,	"계보" : "미주공근의 패",	"무력" : 80,	"지력" : 74,	"통솔력" : 76,	"순발력" : 64,	"행운" : 69,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 관통",	"특성30상세" : "10",	"특성50" : "물리 피해 감소%",	"특성50상세" : "10",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "주위 견고",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "익주(북) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "60",	},
        {	"이름" : "제갈각",	"병종" : "도독",	"코스트" : 7,	"계보" : "미주공근의 패",	"무력" : 54,	"지력" : 92,	"통솔력" : 83,	"순발력" : 68,	"행운" : 74,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "주위 고양",	"특성30상세" : "",	"특성50" : "원소 책략 강화%",	"특성50상세" : "5",	"특성70" : "수전 보조",	"특성70상세" : "",	"특성90" : "상태이상 반사",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "116",	},
        {	"이름" : "손등",	"병종" : "보병",	"코스트" : 7,	"계보" : "미주공근의 패",	"무력" : 66,	"지력" : 79,	"통솔력" : 77,	"순발력" : 74,	"행운" : 84,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "HP 보조%",	"특성30상세" : "15",	"특성50" : "주위 허탈",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "수전 보조",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "38",	},
        {	"이름" : "노숙",	"병종" : "책사",	"코스트" : 9,	"계보" : "미주공근의 패",	"무력" : 52,	"지력" : 92,	"통솔력" : 84,	"순발력" : 72,	"행운" : 90,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "회심 공격 면역",	"특성50상세" : "",	"특성70" : "수계 책략 특화%",	"특성70상세" : "20",	"특성90" : "수전 특화",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "18",	},
        {	"이름" : "감녕",	"병종" : "수군",	"코스트" : 13,	"계보" : "미주공근의 패",	"무력" : 94,	"지력" : 76,	"통솔력" : 93,	"순발력" : 95,	"행운" : 69,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "돌파 공격",	"특성50상세" : "",	"특성70" : "인도 공격",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "7",	},
        {	"이름" : "주유",	"병종" : "도독",	"코스트" : 11,	"계보" : "미주공근의 패",	"무력" : 75,	"지력" : 96,	"통솔력" : 95,	"순발력" : 83,	"행운" : 72,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "원소 책략 강화%",	"특성30상세" : "5",	"특성50" : "연속 책략",	"특성50상세" : "",	"특성70" : "신출귀몰",	"특성70상세" : "10",	"특성90" : "국사무쌍%",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "110",	},
        {	"이름" : "조범",	"병종" : "포차",	"코스트" : 4,	"계보" : "노장한승의 패",	"무력" : 36,	"지력" : 35,	"통솔력" : 28,	"순발력" : 45,	"행운" : 71,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "본대 연병",	"특성70상세" : "",	"특성90" : "방어력 하강 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(남) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "157",	},
        {	"이름" : "한현",	"병종" : "보병",	"코스트" : 4,	"계보" : "노장한승의 패",	"무력" : 22,	"지력" : 37,	"통솔력" : 33,	"순발력" : 44,	"행운" : 38,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 허탈",	"특성50상세" : "",	"특성70" : "사기 보조%",	"특성70상세" : "10",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(남) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "103",	},
        {	"이름" : "미당대왕",	"병종" : "전차",	"코스트" : 4,	"계보" : "노장한승의 패",	"무력" : 69,	"지력" : 31,	"통솔력" : 63,	"순발력" : 46,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "전 방어율 증가",	"특성30상세" : "5",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "주위 욕설",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "165",	},
        {	"이름" : "최염",	"병종" : "궁병",	"코스트" : 6,	"계보" : "노장한승의 패",	"무력" : 69,	"지력" : 82,	"통솔력" : 65,	"순발력" : 80,	"행운" : 58,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "본대 연병",	"특성30상세" : "",	"특성50" : "혼란 공격%",	"특성50상세" : "15",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "무제한 반격",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "23",	},
        {	"이름" : "동화",	"병종" : "궁병",	"코스트" : 6,	"계보" : "노장한승의 패",	"무력" : 62,	"지력" : 83,	"통솔력" : 73,	"순발력" : 72,	"행운" : 66,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "중독 공격%",	"특성30상세" : "15",	"특성50" : "능력 이상 공격%",	"특성50상세" : "15",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "방어력 하강 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "29",	},
        {	"이름" : "오란",	"병종" : "보병",	"코스트" : 6,	"계보" : "노장한승의 패",	"무력" : 80,	"지력" : 59,	"통솔력" : 68,	"순발력" : 72,	"행운" : 62,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 압박",	"특성50상세" : "",	"특성70" : "공격 명중률 증가",	"특성70상세" : "20",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "60",	},
        {	"이름" : "진규",	"병종" : "책사",	"코스트" : 5,	"계보" : "노장한승의 패",	"무력" : 26,	"지력" : 84,	"통솔력" : 76,	"순발력" : 53,	"행운" : 86,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "원소 책략 강화%",	"특성30상세" : "5",	"특성50" : "주위 견고",	"특성50상세" : "",	"특성70" : "연속 책략 강화",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "59",	},
        {	"이름" : "진등",	"병종" : "도독",	"코스트" : 7,	"계보" : "노장한승의 패",	"무력" : 70,	"지력" : 82,	"통솔력" : 89,	"순발력" : 68,	"행운" : 72,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "주위 고양",	"특성30상세" : "",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "MP 공격",	"특성70상세" : "",	"특성90" : "선제 공격",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "111",	},
        {	"이름" : "차주",	"병종" : "보병",	"코스트" : 4,	"계보" : "노장한승의 패",	"무력" : 67,	"지력" : 52,	"통솔력" : 63,	"순발력" : 71,	"행운" : 59,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "주위 허탈",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "HP 보조%",	"특성90상세" : "15",	"태수효과" : "견직",	"군주효과" : "서주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "92",	},
        {	"이름" : "왕충",	"병종" : "창병",	"코스트" : 4,	"계보" : "노장한승의 패",	"무력" : 55,	"지력" : 65,	"통솔력" : 58,	"순발력" : 68,	"행운" : 71,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "주위 둔병",	"특성30상세" : "",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "주위 방해",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "예주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "94",	},
        {	"이름" : "이적",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "노장한승의 패",	"무력" : 38,	"지력" : 81,	"통솔력" : 56,	"순발력" : 72,	"행운" : 62,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "8",	"특성50" : "MP 보조%",	"특성50상세" : "13",	"특성70" : "주위 각성",	"특성70상세" : "",	"특성90" : "주위 고양",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "청주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "81",	},
        {	"이름" : "공손강",	"병종" : "산악기병",	"코스트" : 4,	"계보" : "노장한승의 패",	"무력" : 68,	"지력" : 65,	"통솔력" : 79,	"순발력" : 62,	"행운" : 64,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "10",	"특성50" : "일치단결",	"특성50상세" : "",	"특성70" : "기마 공격 강화 무시",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "139",	},
        {	"이름" : "국연",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "노장한승의 패",	"무력" : 28,	"지력" : 78,	"통솔력" : 69,	"순발력" : 72,	"행운" : 76,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "9",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "주위 집중",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "청주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "92",	},
        {	"이름" : "진도",	"병종" : "창병",	"코스트" : 8,	"계보" : "노장한승의 패",	"무력" : 82,	"지력" : 64,	"통솔력" : 84,	"순발력" : 68,	"행운" : 62,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "인도 공격",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "24",	},
        {	"이름" : "비요",	"병종" : "산악기병",	"코스트" : 8,	"계보" : "노장한승의 패",	"무력" : 82,	"지력" : 72,	"통솔력" : 79,	"순발력" : 77,	"행운" : 61,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "돌진 공격%",	"특성30상세" : "3",	"특성50" : "공격 방어율 관통",	"특성50상세" : "10",	"특성70" : "일격 필살",	"특성70상세" : "50",	"특성90" : "상태이상 반사",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "59",	},
        {	"이름" : "장임",	"병종" : "노병",	"코스트" : 10,	"계보" : "노장한승의 패",	"무력" : 86,	"지력" : 78,	"통솔력" : 89,	"순발력" : 66,	"행운" : 94,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "화상 공격%",	"특성30상세" : "50",	"특성50" : "상태이상 면역",	"특성50상세" : "",	"특성70" : "주동 공격",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "6",	},
        {	"이름" : "황충",	"병종" : "궁기병",	"코스트" : 13,	"계보" : "노장한승의 패",	"무력" : 93,	"지력" : 65,	"통솔력" : 90,	"순발력" : 73,	"행운" : 85,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "지원 공격",	"특성30상세" : "",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "무제한 반격",	"특성70상세" : "",	"특성90" : "피해 범위 변경",	"특성90상세" : "3격",	"태수효과" : "보관의 달인",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "8",	},
        {	"이름" : "고패",	"병종" : "경기병",	"코스트" : 4,	"계보" : "용장익덕의 패",	"무력" : 73,	"지력" : 27,	"통솔력" : 69,	"순발력" : 70,	"행운" : 58,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "주위 방해",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "130",	},
        {	"이름" : "양회",	"병종" : "보병",	"코스트" : 4,	"계보" : "용장익덕의 패",	"무력" : 71,	"지력" : 72,	"통솔력" : 68,	"순발력" : 69,	"행운" : 65,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "책략 방어율 증가",	"특성90상세" : "20",	"태수효과" : "수산물",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "87",	},
        {	"이름" : "황권",	"병종" : "도독",	"코스트" : 6,	"계보" : "용장익덕의 패",	"무력" : 69,	"지력" : 83,	"통솔력" : 76,	"순발력" : 71,	"행운" : 76,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "수전 보조",	"특성30상세" : "",	"특성50" : "공격 범위 변경",	"특성50상세" : "몰우전",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "MP 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "118",	},
        {	"이름" : "엄안",	"병종" : "창병",	"코스트" : 8,	"계보" : "용장익덕의 패",	"무력" : 83,	"지력" : 72,	"통솔력" : 82,	"순발력" : 57,	"행운" : 67,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "피해 범위 변경",	"특성90상세" : "3격",	"태수효과" : "군량 보관",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "54",	},
        {	"이름" : "냉포",	"병종" : "창병",	"코스트" : 4,	"계보" : "용장익덕의 패",	"무력" : 70,	"지력" : 62,	"통솔력" : 79,	"순발력" : 82,	"행운" : 61,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "주위 욕설",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "73",	},
        {	"이름" : "유괴",	"병종" : "전차",	"코스트" : 4,	"계보" : "용장익덕의 패",	"무력" : 72,	"지력" : 67,	"통솔력" : 80,	"순발력" : 78,	"행운" : 68,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "돌진 공격%",	"특성30상세" : "2",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "주위 욕설",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "118",	},
        {	"이름" : "장화",	"병종" : "풍수사",	"코스트" : 5,	"계보" : "용장익덕의 패",	"무력" : 34,	"지력" : 80,	"통솔력" : 67,	"순발력" : 66,	"행운" : 72,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "8",	"특성50" : "주위 기합",	"특성50상세" : "",	"특성70" : "간접 피해 감소%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "유주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "69",	},
        {	"이름" : "오반",	"병종" : "호술사",	"코스트" : 8,	"계보" : "용장익덕의 패",	"무력" : 77,	"지력" : 59,	"통솔력" : 80,	"순발력" : 88,	"행운" : 56,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "연속 공격 면역",	"특성30상세" : "",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "회심 공",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "64",	},
        {	"이름" : "오의",	"병종" : "무인",	"코스트" : 9,	"계보" : "용장익덕의 패",	"무력" : 79,	"지력" : 70,	"통솔력" : 83,	"순발력" : 84,	"행운" : 52,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "연속 반격",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "51",	},
        {	"이름" : "장성채",	"병종" : "경기병",	"코스트" : 11,	"계보" : "용장익덕의 패",	"무력" : 86,	"지력" : 55,	"통솔력" : 81,	"순발력" : 92,	"행운" : 63,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "지형 효과 보조",	"특성30상세" : "",	"특성50" : "무한 인도 공격",	"특성50상세" : "",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "일기당천",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "22",	},
        {	"이름" : "장달",	"병종" : "보병",	"코스트" : 4,	"계보" : "용장익덕의 패",	"무력" : 55,	"지력" : 34,	"통솔력" : 46,	"순발력" : 56,	"행운" : 72,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "책략 피해 반사%",	"특성30상세" : "7",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "분노 축적%",	"특성90상세" : "20",	"태수효과" : "시장",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "98",	},
        {	"이름" : "범강",	"병종" : "창병",	"코스트" : 4,	"계보" : "용장익덕의 패",	"무력" : 54,	"지력" : 32,	"통솔력" : 52,	"순발력" : 69,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "주위 둔병",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "151",	},
        {	"이름" : "이엄",	"병종" : "창병",	"코스트" : 9,	"계보" : "용장익덕의 패",	"무력" : 82,	"지력" : 79,	"통솔력" : 87,	"순발력" : 67,	"행운" : 74,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "방어력 보조%",	"특성30상세" : "10",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "인도 공격",	"특성70상세" : "",	"특성90" : "피해 범위 변경",	"특성90상세" : "3격",	"태수효과" : "경작",	"군주효과" : "익주(남) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "18",	},
        {	"이름" : "풍습",	"병종" : "보병",	"코스트" : 7,	"계보" : "용장익덕의 패",	"무력" : 68,	"지력" : 45,	"통솔력" : 77,	"순발력" : 61,	"행운" : 79,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "39",	},
        {	"이름" : "이이",	"병종" : "경기병",	"코스트" : 4,	"계보" : "용장익덕의 패",	"무력" : 78,	"지력" : 15,	"통솔력" : 68,	"순발력" : 72,	"행운" : 63,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "반격 강화",	"특성50상세" : "",	"특성70" : "연속 공격 강화%",	"특성70상세" : "15",	"특성90" : "기마 공격 강화%",	"특성90상세" : "15",	"태수효과" : "군량 보관",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "118",	},
        {	"이름" : "조루",	"병종" : "노병",	"코스트" : 6,	"계보" : "용장익덕의 패",	"무력" : 59,	"지력" : 72,	"통솔력" : 76,	"순발력" : 82,	"행운" : 70,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "본대 고양",	"특성30상세" : "",	"특성50" : "금책 공격%",	"특성50상세" : "15",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(남) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "56",	},
        {	"이름" : "뇌동",	"병종" : "무인",	"코스트" : 6,	"계보" : "용장익덕의 패",	"무력" : 79,	"지력" : 63,	"통솔력" : 69,	"순발력" : 86,	"행운" : 67,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "88",	},
        {	"이름" : "법정",	"병종" : "책사",	"코스트" : 9,	"계보" : "용장익덕의 패",	"무력" : 47,	"지력" : 94,	"통솔력" : 82,	"순발력" : 62,	"행운" : 79,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "사신 소환",	"특성30상세" : "",	"특성50" : "공격 책략 강화%",	"특성50상세" : "10",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "15",	},
        {	"이름" : "장포",	"병종" : "경기병",	"코스트" : 9,	"계보" : "용장익덕의 패",	"무력" : 87,	"지력" : 48,	"통솔력" : 78,	"순발력" : 81,	"행운" : 70,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "인도 공격",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "37",	},
        {	"이름" : "관은병",	"병종" : "경기병",	"코스트" : 10,	"계보" : "용장익덕의 패",	"무력" : 84,	"지력" : 75,	"통솔력" : 79,	"순발력" : 63,	"행운" : 88,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "연속 반격",	"특성70상세" : "",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "33",	},
        {	"이름" : "장비",	"병종" : "경기병",	"코스트" : 13,	"계보" : "용장익덕의 패",	"무력" : 98,	"지력" : 46,	"통솔력" : 94,	"순발력" : 91,	"행운" : 67,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "분전 공격",	"특성50상세" : "",	"특성70" : "일기당천",	"특성70상세" : "",	"특성90" : "만인지적",	"특성90상세" : "10",	"태수효과" : "군량 징세",	"군주효과" : "전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "3",	},
        {	"이름" : "양송",	"병종" : "포차",	"코스트" : 4,	"계보" : "만족맹기의 패",	"무력" : 25,	"지력" : 38,	"통솔력" : 22,	"순발력" : 34,	"행운" : 55,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "공격 명중률 증가",	"특성50상세" : "17",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "순발력 하강 공격",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "160",	},
        {	"이름" : "양홍",	"병종" : "포차",	"코스트" : 4,	"계보" : "만족맹기의 패",	"무력" : 46,	"지력" : 76,	"통솔력" : 56,	"순발력" : 42,	"행운" : 62,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "본대 연병",	"특성30상세" : "",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "물리 필중",	"특성70상세" : "",	"특성90" : "중독 공격%",	"특성90상세" : "20",	"태수효과" : "항만",	"군주효과" : "형주(북)",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "155",	},
        {	"이름" : "왕보",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "만족맹기의 패",	"무력" : 58,	"지력" : 84,	"통솔력" : 76,	"순발력" : 54,	"행운" : 60,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "15",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "간접 피해 감소%",	"특성90상세" : "20",	"태수효과" : "경작",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "76",	},
        {	"이름" : "염행",	"병종" : "전차",	"코스트" : 9,	"계보" : "만족맹기의 패",	"무력" : 88,	"지력" : 38,	"통솔력" : 73,	"순발력" : 72,	"행운" : 79,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "방어력 보조",	"특성30상세" : "25",	"특성50" : "공격력 보조%",	"특성50상세" : "11",	"특성70" : "주위 욕설",	"특성70상세" : "",	"특성90" : "돌진 공격%",	"특성90상세" : "4",	"태수효과" : "과수",	"군주효과" : "옹주(동) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "156",	},
        {	"이름" : "마요희",	"병종" : "경기병",	"코스트" : 7,	"계보" : "만족맹기의 패",	"무력" : 79,	"지력" : 62,	"통솔력" : 70,	"순발력" : 85,	"행운" : 68,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "공격 방어율 증가",	"특성50상세" : "12",	"특성70" : "분노 축적%",	"특성70상세" : "20",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "75",	},
        {	"이름" : "성공영",	"병종" : "전차",	"코스트" : 6,	"계보" : "만족맹기의 패",	"무력" : 69,	"지력" : 80,	"통솔력" : 78,	"순발력" : 74,	"행운" : 62,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "책략 피해 반사%",	"특성30상세" : "7",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "방어력 보조",	"특성70상세" : "30",	"특성90" : "돌진 공격%",	"특성90상세" : "4",	"태수효과" : "공방",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "115",	},
        {	"이름" : "한수",	"병종" : "전차",	"코스트" : 8,	"계보" : "만족맹기의 패",	"무력" : 75,	"지력" : 85,	"통솔력" : 81,	"순발력" : 61,	"행운" : 73,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "돌진 공격%",	"특성30상세" : "2",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "주위 욕설",	"특성70상세" : "",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "옹주(서) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "109",	},
        {	"이름" : "마운록",	"병종" : "궁기병",	"코스트" : 6,	"계보" : "만족맹기의 패",	"무력" : 83,	"지력" : 46,	"통솔력" : 73,	"순발력" : 62,	"행운" : 65,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "지원 공격",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "83",	},
        {	"이름" : "한복",	"병종" : "보병",	"코스트" : 4,	"계보" : "만족맹기의 패",	"무력" : 42,	"지력" : 63,	"통솔력" : 52,	"순발력" : 36,	"행운" : 84,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 증가",	"특성30상세" : "15",	"특성50" : "주위 허탈",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "97",	},
        {	"이름" : "장송",	"병종" : "책사",	"코스트" : 5,	"계보" : "만족맹기의 패",	"무력" : 23,	"지력" : 90,	"통솔력" : 32,	"순발력" : 81,	"행운" : 59,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "원소 책략 강화%",	"특성30상세" : "5",	"특성50" : "지계 책략 강화%",	"특성50상세" : "15",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "익주(북) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "54",	},
        {	"이름" : "마휴",	"병종" : "궁기병",	"코스트" : 6,	"계보" : "만족맹기의 패",	"무력" : 75,	"지력" : 48,	"통솔력" : 72,	"순발력" : 77,	"행운" : 68,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "지원 공격",	"특성30상세" : "",	"특성50" : "부동 공격%",	"특성50상세" : "15",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "95",	},
        {	"이름" : "이회",	"병종" : "풍수사",	"코스트" : 5,	"계보" : "만족맹기의 패",	"무력" : 68,	"지력" : 76,	"통솔력" : 81,	"순발력" : 69,	"행운" : 75,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "8",	"특성50" : "주위 연병",	"특성50상세" : "",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "익주(남) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "73",	},
        {	"이름" : "양부",	"병종" : "중기병",	"코스트" : 7,	"계보" : "만족맹기의 패",	"무력" : 69,	"지력" : 81,	"통솔력" : 79,	"순발력" : 64,	"행운" : 82,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "본대 견고",	"특성70상세" : "",	"특성90" : "분노 축적%",	"특성90상세" : "20",	"태수효과" : "시장",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "35",	},
        {	"이름" : "마대",	"병종" : "전차",	"코스트" : 8,	"계보" : "만족맹기의 패",	"무력" : 85,	"지력" : 56,	"통솔력" : 79,	"순발력" : 56,	"행운" : 62,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "돌진 공격%",	"특성30상세" : "2",	"특성50" : "공격력 보조%",	"특성50상세" : "11",	"특성70" : "공격 방어율 관통",	"특성70상세" : "10",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "159",	},
        {	"이름" : "마등",	"병종" : "전차",	"코스트" : 9,	"계보" : "만족맹기의 패",	"무력" : 85,	"지력" : 57,	"통솔력" : 83,	"순발력" : 72,	"행운" : 67,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "7",	"특성50" : "돌진 공격%",	"특성50상세" : "3",	"특성70" : "방어력 보조",	"특성70상세" : "30",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "158",	},
        {	"이름" : "왕이",	"병종" : "경기병",	"코스트" : 8,	"계보" : "만족맹기의 패",	"무력" : 71,	"지력" : 85,	"통솔력" : 86,	"순발력" : 82,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "돌진 공격%",	"특성50상세" : "3",	"특성70" : "기습 공격",	"특성70상세" : "",	"특성90" : "파진 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "73",	},
        {	"이름" : "마초",	"병종" : "산악기병",	"코스트" : 13,	"계보" : "만족맹기의 패",	"무력" : 97,	"지력" : 46,	"통솔력" : 93,	"순발력" : 71,	"행운" : 82,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "20",	"특성50" : "일기당천",	"특성50상세" : "",	"특성70" : "파진 공격",	"특성70상세" : "",	"특성90" : "금마초",	"특성90상세" : "10",	"태수효과" : "은전 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "4",	},
        {	"이름" : "채중",	"병종" : "창병",	"코스트" : 4,	"계보" : "마왕패도의 패",	"무력" : 47,	"지력" : 13,	"통솔력" : 44,	"순발력" : 42,	"행운" : 55,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "주위 둔병",	"특성70상세" : "",	"특성90" : "수전 보조",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "익주(남) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "154",	},
        {	"이름" : "조상",	"병종" : "군주",	"코스트" : 4,	"계보" : "마왕패도의 패",	"무력" : 69,	"지력" : 63,	"통솔력" : 71,	"순발력" : 61,	"행운" : 71,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "순발력 보조%",	"특성30상세" : "10",	"특성50" : "주위 기합",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "상태이상 반사",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "청주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "71",	},
        {	"이름" : "장제",	"병종" : "경기병",	"코스트" : 4,	"계보" : "마왕패도의 패",	"무력" : 67,	"지력" : 55,	"통솔력" : 70,	"순발력" : 73,	"행운" : 67,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 방해",	"특성30상세" : "",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "연속 공격 강화%",	"특성70상세" : "15",	"특성90" : "기마 공격 강화%",	"특성90상세" : "15",	"태수효과" : "징세의 달인",	"군주효과" : "옹주(서) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "140",	},
        {	"이름" : "유소",	"병종" : "보병",	"코스트" : 4,	"계보" : "마왕패도의 패",	"무력" : 58,	"지력" : 82,	"통솔력" : 71,	"순발력" : 68,	"행운" : 72,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "간접 피해 감소%",	"특성30상세" : "7",	"특성50" : "전 방어율 증가",	"특성50상세" : "6",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "책략 방어율 증가",	"특성90상세" : "20",	"태수효과" : "시장",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "83",	},
        {	"이름" : "염유",	"병종" : "경기병",	"코스트" : 7,	"계보" : "마왕패도의 패",	"무력" : 68,	"지력" : 72,	"통솔력" : 71,	"순발력" : 74,	"행운" : 74,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "물리 피해 감소%",	"특성50상세" : "10",	"특성70" : "주위 방해",	"특성70상세" : "",	"특성90" : "간접 피해 감소%",	"특성90상세" : "10",	"태수효과" : "보관의 달인",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "89",	},
        {	"이름" : "조절",	"병종" : "무희",	"코스트" : 8,	"계보" : "마왕패도의 패",	"무력" : 64,	"지력" : 82,	"통솔력" : 82,	"순발력" : 85,	"행운" : 66,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "연속 반격",	"특성50상세" : "",	"특성70" : "주위 기합",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "14",	},
        {	"이름" : "장수",	"병종" : "군주",	"코스트" : 6,	"계보" : "마왕패도의 패",	"무력" : 75,	"지력" : 64,	"통솔력" : 80,	"순발력" : 78,	"행운" : 61,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "주위 고양",	"특성30상세" : "",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "지형 효과 보조",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "65",	},
        {	"이름" : "주창",	"병종" : "적병",	"코스트" : 9,	"계보" : "마왕패도의 패",	"무력" : 87,	"지력" : 42,	"통솔력" : 68,	"순발력" : 68,	"행운" : 84,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "회심 공격",	"특성30상세" : "",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "공격력 보조%",	"특성70상세" : "13",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "19",	},
        {	"이름" : "온회",	"병종" : "노병",	"코스트" : 6,	"계보" : "마왕패도의 패",	"무력" : 59,	"지력" : 84,	"통솔력" : 78,	"순발력" : 55,	"행운" : 78,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "사기 하강 공격",	"특성30상세" : "",	"특성50" : "사기 보조%",	"특성50상세" : "10",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "공격력 보조%",	"특성90상세" : "15",	"태수효과" : "절대 보호",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "46",	},
        {	"이름" : "채화",	"병종" : "수군",	"코스트" : 4,	"계보" : "마왕패도의 패",	"무력" : 51,	"지력" : 15,	"통솔력" : 42,	"순발력" : 62,	"행운" : 33,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "수계 책략 강화%",	"특성70상세" : "9",	"특성90" : "맹독 공격%",	"특성90상세" : "50",	"태수효과" : "경작",	"군주효과" : "청주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "153",	},
        {	"이름" : "순심",	"병종" : "도사",	"코스트" : 4,	"계보" : "마왕패도의 패",	"무력" : 28,	"지력" : 78,	"통솔력" : 45,	"순발력" : 62,	"행운" : 72,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 모방",	"특성30상세" : "",	"특성50" : "주위 압박",	"특성50상세" : "",	"특성70" : "방해계 책략 강화%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "90",	},
        {	"이름" : "악취",	"병종" : "무인",	"코스트" : 4,	"계보" : "마왕패도의 패",	"무력" : 69,	"지력" : 58,	"통솔력" : 56,	"순발력" : 79,	"행운" : 55,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "책략 피해 감소%",	"특성30상세" : "10",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "금격 공격%",	"특성90상세" : "20",	"태수효과" : "군량 보관",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "137",	},
        {	"이름" : "엄준",	"병종" : "궁병",	"코스트" : 6,	"계보" : "마왕패도의 패",	"무력" : 56,	"지력" : 84,	"통솔력" : 71,	"순발력" : 76,	"행운" : 55,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "부동 공격%",	"특성50상세" : "15",	"특성70" : "책략 방어율 증가",	"특성70상세" : "15",	"특성90" : "방어력 하강 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "27",	},
        {	"이름" : "가규",	"병종" : "도사",	"코스트" : 5,	"계보" : "마왕패도의 패",	"무력" : 71,	"지력" : 84,	"통솔력" : 65,	"순발력" : 58,	"행운" : 83,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "8",	"특성50" : "HP 보조%",	"특성50상세" : "15",	"특성70" : "상태이상 반사",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "60",	},
        {	"이름" : "하후덕",	"병종" : "산악기병",	"코스트" : 4,	"계보" : "마왕패도의 패",	"무력" : 72,	"지력" : 59,	"통솔력" : 68,	"순발력" : 81,	"행운" : 62,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "기마 공격 강화 무시",	"특성30상세" : "",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "연속 공격 강화%",	"특성90상세" : "15",	"태수효과" : "견직",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "133",	},
        {	"이름" : "정원",	"병종" : "산악기병",	"코스트" : 8,	"계보" : "마왕패도의 패",	"무력" : 79,	"지력" : 45,	"통솔력" : 75,	"순발력" : 87,	"행운" : 69,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 압박",	"특성30상세" : "",	"특성50" : "돌파 공격",	"특성50상세" : "",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "61",	},
        {	"이름" : "호거아",	"병종" : "무인",	"코스트" : 9,	"계보" : "마왕패도의 패",	"무력" : 85,	"지력" : 45,	"통솔력" : 70,	"순발력" : 92,	"행운" : 69,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "8",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "옹주(서) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "41",	},
        {	"이름" : "위연",	"병종" : "무인",	"코스트" : 11,	"계보" : "마왕패도의 패",	"무력" : 94,	"지력" : 73,	"통솔력" : 85,	"순발력" : 91,	"행운" : 66,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "철옹성",	"특성30상세" : "",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "15",	},
        {	"이름" : "서막",	"병종" : "노병",	"코스트" : 5,	"계보" : "마왕패도의 패",	"무력" : 63,	"지력" : 81,	"통솔력" : 77,	"순발력" : 71,	"행운" : 66,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "부동 공격%",	"특성70상세" : "30",	"특성90" : "정신력 하강 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "69",	},
        {	"이름" : "진교",	"병종" : "포차",	"코스트" : 6,	"계보" : "마왕패도의 패",	"무력" : 54,	"지력" : 80,	"통솔력" : 58,	"순발력" : 62,	"행운" : 77,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "본대 연병",	"특성30상세" : "",	"특성50" : "공격 명중률 증가",	"특성50상세" : "17",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "125",	},
        {	"이름" : "제갈량",	"병종" : "마왕",	"코스트" : 12,	"계보" : "마왕패도의 패",	"무력" : 34,	"지력" : 100,	"통솔력" : 98,	"순발력" : 77,	"행운" : 96,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "풍계 책략 특화%",	"특성50상세" : "20",	"특성70" : "사신 보옥 착용",	"특성70상세" : "",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "전 약탈",	"별칭" : "마갈량",	"추천병종" : "책략훈련부",	"추천병종순" : "2",	},
        {	"이름" : "대래동주",	"병종" : "호술사",	"코스트" : 4,	"계보" : "칠금만왕의 패",	"무력" : 62,	"지력" : 55,	"통솔력" : 61,	"순발력" : 63,	"행운" : 72,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "인도 공격",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "142",	},
        {	"이름" : "고정",	"병종" : "보병",	"코스트" : 4,	"계보" : "칠금만왕의 패",	"무력" : 69,	"지력" : 38,	"통솔력" : 65,	"순발력" : 66,	"행운" : 72,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "HP 보조%",	"특성50상세" : "",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "책략 방어율 증가",	"특성90상세" : "20",	"태수효과" : "시장",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "90",	},
        {	"이름" : "맹우",	"병종" : "호술사",	"코스트" : 4,	"계보" : "칠금만왕의 패",	"무력" : 76,	"지력" : 58,	"통솔력" : 67,	"순발력" : 74,	"행운" : 82,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "HP 보조%",	"특성30상세" : "15",	"특성50" : "주위 허탈",	"특성50상세" : "",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "123",	},
        {	"이름" : "아회남",	"병종" : "경기병",	"코스트" : 4,	"계보" : "칠금만왕의 패",	"무력" : 75,	"지력" : 33,	"통솔력" : 66,	"순발력" : 71,	"행운" : 78,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "주위 고양",	"특성50상세" : "",	"특성70" : "주위 방해",	"특성70상세" : "",	"특성90" : "기마 공격 강화 무시",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "124",	},
        {	"이름" : "해니",	"병종" : "창병",	"코스트" : 4,	"계보" : "칠금만왕의 패",	"무력" : 80,	"지력" : 40,	"통솔력" : 69,	"순발력" : 67,	"행운" : 80,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화%",	"특성30상세" : "15",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "주위 둔병",	"특성70상세" : "",	"특성90" : "본대 강행",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "117",	},
        {	"이름" : "동도나",	"병종" : "적병",	"코스트" : 6,	"계보" : "칠금만왕의 패",	"무력" : 78,	"지력" : 33,	"통솔력" : 69,	"순발력" : 66,	"행운" : 88,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "지계 책략 강화%",	"특성30상세" : "10",	"특성50" : "혼란 공격%",	"특성50상세" : "15",	"특성70" : "공격력 보조%",	"특성70상세" : "13",	"특성90" : "맹독 공격%",	"특성90상세" : "50",	"태수효과" : "경작",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "38",	},
        {	"이름" : "화만",	"병종" : "웅술사",	"코스트" : 8,	"계보" : "칠금만왕의 패",	"무력" : 75,	"지력" : 57,	"통솔력" : 68,	"순발력" : 89,	"행운" : 66,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "주위 연병",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "37",	},
        {	"이름" : "올돌골",	"병종" : "보병",	"코스트" : 9,	"계보" : "칠금만왕의 패",	"무력" : 89,	"지력" : 24,	"통솔력" : 72,	"순발력" : 88,	"행운" : 56,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "HP 보조%",	"특성30상세" : "15",	"특성50" : "주위 압박",	"특성50상세" : "",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "맹독 공격%",	"특성90상세" : "50",	"태수효과" : "절대 보호",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "25",	},
        {	"이름" : "아하소과",	"병종" : "전차",	"코스트" : 5,	"계보" : "칠금만왕의 패",	"무력" : 78,	"지력" : 12,	"통솔력" : 61,	"순발력" : 56,	"행운" : 68,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "주위 욕설",	"특성30상세" : "",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "공격 방어율 증가",	"특성70상세" : "20",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "164",	},
        {	"이름" : "옹개",	"병종" : "보병",	"코스트" : 5,	"계보" : "칠금만왕의 패",	"무력" : 72,	"지력" : 59,	"통솔력" : 78,	"순발력" : 62,	"행운" : 52,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "전 방어율 증가",	"특성30상세" : "7",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "HP 보조%",	"특성90상세" : "15",	"태수효과" : "견직",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "61",	},
        {	"이름" : "금환삼결",	"병종" : "호술사",	"코스트" : 6,	"계보" : "칠금만왕의 패",	"무력" : 80,	"지력" : 19,	"통솔력" : 69,	"순발력" : 77,	"행운" : 55,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "주위 연병",	"특성30상세" : "",	"특성50" : "맹독 공격%",	"특성50상세" : "50",	"특성70" : "HP 보조%",	"특성70상세" : "15",	"특성90" : "선제 공격",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "86",	},
        {	"이름" : "타사대왕",	"병종" : "도사",	"코스트" : 4,	"계보" : "칠금만왕의 패",	"무력" : 58,	"지력" : 75,	"통솔력" : 32,	"순발력" : 78,	"행운" : 85,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "8",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "상태이상 반사",	"특성70상세" : "",	"특성90" : "MP 공격",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "97",	},
        {	"이름" : "망아장",	"병종" : "산악기병",	"코스트" : 4,	"계보" : "칠금만왕의 패",	"무력" : 81,	"지력" : 22,	"통솔력" : 55,	"순발력" : 81,	"행운" : 69,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "7",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "기마 공격 강화 무시",	"특성70상세" : "",	"특성90" : "맹독 공격%",	"특성90상세" : "50",	"태수효과" : "수산물",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "116",	},
        {	"이름" : "사마가",	"병종" : "호술사",	"코스트" : 7,	"계보" : "칠금만왕의 패",	"무력" : 85,	"지력" : 28,	"통솔력" : 66,	"순발력" : 77,	"행운" : 68,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "공격 방어율 관통",	"특성30상세" : "10",	"특성50" : "연속 공격 강화%",	"특성50상세" : "30",	"특성70" : "회심 공격",	"특성70상세" : "",	"특성90" : "파진 공격",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "형주(남) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "67",	},
        {	"이름" : "축융",	"병종" : "무희",	"코스트" : 9,	"계보" : "칠금만왕의 패",	"무력" : 85,	"지력" : 39,	"통솔력" : 74,	"순발력" : 93,	"행운" : 63,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "주위 기합",	"특성30상세" : "",	"특성50" : "신출귀몰",	"특성50상세" : "",	"특성70" : "주위 강행",	"특성70상세" : "",	"특성90" : "MP 공격",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "10",	},
        {	"이름" : "목록대왕",	"병종" : "웅술사",	"코스트" : 6,	"계보" : "칠금만왕의 패",	"무력" : 71,	"지력" : 28,	"통솔력" : 73,	"순발력" : 61,	"행운" : 88,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "HP 보조%",	"특성30상세" : "15",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(남) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "50",	},
        {	"이름" : "맹획",	"병종" : "웅술사",	"코스트" : 11,	"계보" : "칠금만왕의 패",	"무력" : 87,	"지력" : 42,	"통솔력" : 83,	"순발력" : 73,	"행운" : 79,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "맹독 공격%",	"특성30상세" : "50",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "피해 범위 변경",	"특성70상세" : "2격",	"특성90" : "돌진 공격%",	"특성90상세" : "4",	"태수효과" : "보관의 달인",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "7",	},
        {	"이름" : "전주",	"병종" : "궁병",	"코스트" : 7,	"계보" : "황숙현덕의 패",	"무력" : 72,	"지력" : 72,	"통솔력" : 79,	"순발력" : 69,	"행운" : 82,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "사기 보조%",	"특성50상세" : "10",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "순발력 하강 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "유주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "24",	},
        {	"이름" : "왕광",	"병종" : "산악기병",	"코스트" : 7,	"계보" : "황숙현덕의 패",	"무력" : 65,	"지력" : 66,	"통솔력" : 85,	"순발력" : 83,	"행운" : 59,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "돌진 공격%",	"특성30상세" : "2",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "기마 공격 강화 무시",	"특성70상세" : "",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "96",	},
        {	"이름" : "공지",	"병종" : "포차",	"코스트" : 4,	"계보" : "황숙현덕의 패",	"무력" : 59,	"지력" : 61,	"통솔력" : 45,	"순발력" : 38,	"행운" : 82,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "공격 명중률 증가",	"특성30상세" : "15",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "148",	},
        {	"이름" : "예형",	"병종" : "도사",	"코스트" : 4,	"계보" : "황숙현덕의 패",	"무력" : 29,	"지력" : 81,	"통솔력" : 33,	"순발력" : 69,	"행운" : 66,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "HP 보조%",	"특성50상세" : "15",	"특성70" : "방해계 책략 강화%",	"특성70상세" : "10",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "78",	},
        {	"이름" : "비관",	"병종" : "보병",	"코스트" : 4,	"계보" : "황숙현덕의 패",	"무력" : 67,	"지력" : 44,	"통솔력" : 65,	"순발력" : 68,	"행운" : 77,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "책략 방어율 증가",	"특성90상세" : "20",	"태수효과" : "군량 보관",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "89",	},
        {	"이름" : "향총",	"병종" : "보병",	"코스트" : 6,	"계보" : "황숙현덕의 패",	"무력" : 66,	"지력" : 76,	"통솔력" : 80,	"순발력" : 63,	"행운" : 70,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 허탈",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "책략 방어율 증가",	"특성90상세" : "20",	"태수효과" : "시장",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "46",	},
        {	"이름" : "동윤",	"병종" : "풍수사",	"코스트" : 7,	"계보" : "황숙현덕의 패",	"무력" : 30,	"지력" : 87,	"통솔력" : 61,	"순발력" : 69,	"행운" : 90,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "15",	"특성50" : "회심 공격 면역",	"특성50상세" : "",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "40",	},
        {	"이름" : "왕평",	"병종" : "궁병",	"코스트" : 9,	"계보" : "황숙현덕의 패",	"무력" : 80,	"지력" : 76,	"통솔력" : 84,	"순발력" : 66,	"행운" : 92,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "공격력 하강 공격",	"특성30상세" : "",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "지원 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "18",	},
        {	"이름" : "관평",	"병종" : "경기병",	"코스트" : 9,	"계보" : "황숙현덕의 패",	"무력" : 83,	"지력" : 72,	"통솔력" : 82,	"순발력" : 77,	"행운" : 60,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "책략 방어술%",	"특성30상세" : "30",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "인도 공격",	"특성70상세" : "",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "45",	},
        {	"이름" : "채염",	"병종" : "책사",	"코스트" : 8,	"계보" : "황숙현덕의 패",	"무력" : 42,	"지력" : 95,	"통솔력" : 75,	"순발력" : 79,	"행운" : 90,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "사신 소환",	"특성50상세" : "",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "연속 책략",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "22",	},
        {	"이름" : "유종",	"병종" : "수군",	"코스트" : 4,	"계보" : "황숙현덕의 패",	"무력" : 24,	"지력" : 35,	"통솔력" : 22,	"순발력" : 44,	"행운" : 58,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "방어력 보조%",	"특성30상세" : "10",	"특성50" : "공격 명중률 증가",	"특성50상세" : "15",	"특성70" : "사기 보조%",	"특성70상세" : "10",	"특성90" : "연속 책략 면역",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "형주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "161",	},
        {	"이름" : "유장",	"병종" : "군주",	"코스트" : 4,	"계보" : "황숙현덕의 패",	"무력" : 36,	"지력" : 63,	"통솔력" : 51,	"순발력" : 73,	"행운" : 89,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "주위 견고",	"특성50상세" : "",	"특성70" : "순발력 보조%",	"특성70상세" : "10",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "58",	},
        {	"이름" : "유봉",	"병종" : "보병",	"코스트" : 7,	"계보" : "황숙현덕의 패",	"무력" : 79,	"지력" : 57,	"통솔력" : 75,	"순발력" : 68,	"행운" : 60,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "전 방어율 증가",	"특성30상세" : "7",	"특성50" : "주위 방해",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "41",	},
        {	"이름" : "도겸",	"병종" : "군주",	"코스트" : 4,	"계보" : "황숙현덕의 패",	"무력" : 74,	"지력" : 72,	"통솔력" : 64,	"순발력" : 64,	"행운" : 56,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "주위 집중",	"특성50상세" : "",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "양주(북) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "73",	},
        {	"이름" : "장준",	"병종" : "궁기병",	"코스트" : 5,	"계보" : "황숙현덕의 패",	"무력" : 73,	"지력" : 78,	"통솔력" : 81,	"순발력" : 75,	"행운" : 70,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "지원 공격",	"특성30상세" : "",	"특성50" : "기마 공격 강화%",	"특성50상세" : "15",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "공격력 하강 공격",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "모의전",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "111",	},
        {	"이름" : "유우",	"병종" : "군주",	"코스트" : 7,	"계보" : "황숙현덕의 패",	"무력" : 61,	"지력" : 84,	"통솔력" : 78,	"순발력" : 62,	"행운" : 94,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "주위 기합",	"특성50상세" : "",	"특성70" : "상태이상 반사",	"특성70상세" : "",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "26",	},
        {	"이름" : "하후홍",	"병종" : "책사",	"코스트" : 6,	"계보" : "황숙현덕의 패",	"무력" : 24,	"지력" : 86,	"통솔력" : 46,	"순발력" : 77,	"행운" : 92,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "화계 책략 강화%",	"특성50상세" : "15",	"특성70" : "연속 책략 강화",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "형주(북) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "44",	},
        {	"이름" : "유언",	"병종" : "노병",	"코스트" : 8,	"계보" : "황숙현덕의 패",	"무력" : 69,	"지력" : 80,	"통솔력" : 76,	"순발력" : 63,	"행운" : 88,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "사기 보조%",	"특성50상세" : "10",	"특성70" : "정신력 하강 공격",	"특성70상세" : "",	"특성90" : "주위 고양",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "24",	},
        {	"이름" : "관색",	"병종" : "궁기병",	"코스트" : 9,	"계보" : "황숙현덕의 패",	"무력" : 88,	"지력" : 56,	"통솔력" : 74,	"순발력" : 62,	"행운" : 93,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "지원 공격",	"특성50상세" : "",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "형주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "36",	},
        {	"이름" : "포삼랑",	"병종" : "무인",	"코스트" : 9,	"계보" : "황숙현덕의 패",	"무력" : 79,	"지력" : 62,	"통솔력" : 72,	"순발력" : 95,	"행운" : 77,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "연속 반격",	"특성30상세" : "",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "군량 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "50",	},
        {	"이름" : "유비",	"병종" : "군주",	"코스트" : 10,	"계보" : "황숙현덕의 패",	"무력" : 77,	"지력" : 78,	"통솔력" : 81,	"순발력" : 91,	"행운" : 99,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "주위 기합",	"특성30상세" : "",	"특성50" : "삼고초려",	"특성50상세" : "50",	"특성70" : "쌍검술",	"특성70상세" : "",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "전 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "4",	},
        {	"이름" : "문흠",	"병종" : "중기병",	"코스트" : 9,	"계보" : "문소황후의 패",	"무력" : 87,	"지력" : 42,	"통솔력" : 79,	"순발력" : 65,	"행운" : 74,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "간접 피해 감소%",	"특성70상세" : "10",	"특성90" : "피해 범위 변경",	"특성90상세" : "2격",	"태수효과" : "은전 보관",	"군주효과" : "교주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "21",	},
        {	"이름" : "조휴",	"병종" : "노병",	"코스트" : 8,	"계보" : "문소황후의 패",	"무력" : 82,	"지력" : 62,	"통솔력" : 81,	"순발력" : 77,	"행운" : 62,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "정신력 하강 공격",	"특성30상세" : "",	"특성50" : "혼란 공격%",	"특성50상세" : "30",	"특성70" : "조준 사격%",	"특성70상세" : "4",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "40",	},
        {	"이름" : "문빙",	"병종" : "수군",	"코스트" : 10,	"계보" : "문소황후의 패",	"무력" : 86,	"지력" : 64,	"통솔력" : 82,	"순발력" : 79,	"행운" : 72,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "인도 공격",	"특성30상세" : "",	"특성50" : "공격 명중률 증가",	"특성50상세" : "15",	"특성70" : "신출귀몰",	"특성70상세" : "",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "31",	},
        {	"이름" : "채모",	"병종" : "도독",	"코스트" : 7,	"계보" : "문소황후의 패",	"무력" : 79,	"지력" : 76,	"통솔력" : 84,	"순발력" : 75,	"행운" : 68,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "수전 보조",	"특성30상세" : "",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "원소 책략 강화%",	"특성70상세" : "5",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "형주(남) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "112",	},
        {	"이름" : "하후무",	"병종" : "중기병",	"코스트" : 4,	"계보" : "문소황후의 패",	"무력" : 24,	"지력" : 22,	"통솔력" : 20,	"순발력" : 62,	"행운" : 34,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "간접 피해 감소%",	"특성70상세" : "10",	"특성90" : "본대 강행",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "110",	},
        {	"이름" : "부하",	"병종" : "풍수사",	"코스트" : 5,	"계보" : "문소황후의 패",	"무력" : 44,	"지력" : 87,	"통솔력" : 68,	"순발력" : 58,	"행운" : 69,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "15",	"특성50" : "주위 각성",	"특성50상세" : "",	"특성70" : "보급계 책략 강화%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "56",	},
        {	"이름" : "조식",	"병종" : "도사",	"코스트" : 7,	"계보" : "문소황후의 패",	"무력" : 30,	"지력" : 90,	"통솔력" : 62,	"순발력" : 82,	"행운" : 78,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 모방",	"특성30상세" : "",	"특성50" : "상태이상 면역",	"특성50상세" : "",	"특성70" : "방해계 책략 강화%",	"특성70상세" : "15",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "예주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "31",	},
        {	"이름" : "조진",	"병종" : "전차",	"코스트" : 9,	"계보" : "문소황후의 패",	"무력" : 68,	"지력" : 70,	"통솔력" : 88,	"순발력" : 71,	"행운" : 87,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "기습 공격%",	"특성30상세" : "3",	"특성50" : "돌파 공격",	"특성50상세" : "",	"특성70" : "일격 필살",	"특성70상세" : "50",	"특성90" : "일기당천",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "청주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "100",	},
        {	"이름" : "제갈탄",	"병종" : "군주",	"코스트" : 7,	"계보" : "문소황후의 패",	"무력" : 74,	"지력" : 78,	"통솔력" : 81,	"순발력" : 86,	"행운" : 65,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "주위 고양",	"특성50상세" : "",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "지형 효과 보조",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "51",	},
        {	"이름" : "종회",	"병종" : "도독",	"코스트" : 7,	"계보" : "문소황후의 패",	"무력" : 64,	"지력" : 91,	"통솔력" : 84,	"순발력" : 72,	"행운" : 79,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "공격 방어율 관통",	"특성30상세" : "",	"특성50" : "지형 효과 보조",	"특성50상세" : "",	"특성70" : "MP 공격",	"특성70상세" : "",	"특성90" : "방어 능력 전환",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "117",	},
        {	"이름" : "신헌영",	"병종" : "책사",	"코스트" : 4,	"계보" : "문소황후의 패",	"무력" : 12,	"지력" : 83,	"통솔력" : 26,	"순발력" : 75,	"행운" : 81,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "주위 고양",	"특성50상세" : "",	"특성70" : "책략 피해 반사%",	"특성70상세" : "10",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "양주(남) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "77",	},
        {	"이름" : "한호",	"병종" : "창병",	"코스트" : 8,	"계보" : "문소황후의 패",	"무력" : 75,	"지력" : 86,	"통솔력" : 72,	"순발력" : 68,	"행운" : 74,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "기마 공격 강화%",	"특성30상세" : "15",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "주위 허탈",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "66",	},
        {	"이름" : "조순",	"병종" : "중기병",	"코스트" : 8,	"계보" : "문소황후의 패",	"무력" : 75,	"지력" : 60,	"통솔력" : 81,	"순발력" : 69,	"행운" : 91,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "본대 견고",	"특성30상세" : "",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 반사%",	"특성70상세" : "12",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "연주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "27",	},
        {	"이름" : "양호",	"병종" : "도독",	"코스트" : 8,	"계보" : "문소황후의 패",	"무력" : 72,	"지력" : 87,	"통솔력" : 90,	"순발력" : 66,	"행운" : 85,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "MP 공격",	"특성30상세" : "",	"특성50" : "전 방어율 증가",	"특성50상세" : "6",	"특성70" : "흡혈 공격%",	"특성70상세" : "7",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "104",	},
        {	"이름" : "장특",	"병종" : "궁병",	"코스트" : 6,	"계보" : "문소황후의 패",	"무력" : 67,	"지력" : 81,	"통솔력" : 76,	"순발력" : 77,	"행운" : 70,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "본대 연병",	"특성30상세" : "",	"특성50" : "금격 공격%",	"특성50상세" : "15",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "방어력 하강 공격",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "유주 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "26",	},
        {	"이름" : "조화",	"병종" : "경기병",	"코스트" : 6,	"계보" : "문소황후의 패",	"무력" : 61,	"지력" : 69,	"통솔력" : 56,	"순발력" : 67,	"행운" : 83,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "주위 방해",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "유주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "112",	},
        {	"이름" : "손례",	"병종" : "무인",	"코스트" : 9,	"계보" : "문소황후의 패",	"무력" : 81,	"지력" : 72,	"통솔력" : 76,	"순발력" : 89,	"행운" : 73,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "본대 견고",	"특성70상세" : "",	"특성90" : "피해 범위 변경",	"특성90상세" : "2격",	"태수효과" : "제재소",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "47",	},
        {	"이름" : "양습",	"병종" : "산악기병",	"코스트" : 8,	"계보" : "문소황후의 패",	"무력" : 72,	"지력" : 84,	"통솔력" : 79,	"순발력" : 79,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 압박",	"특성30상세" : "",	"특성50" : "기마 공격 강화 무시",	"특성50상세" : "",	"특성70" : "상태이상 반사",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "71",	},
        {	"이름" : "조예",	"병종" : "군주",	"코스트" : 7,	"계보" : "문소황후의 패",	"무력" : 66,	"지력" : 85,	"통솔력" : 86,	"순발력" : 72,	"행운" : 79,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "주위 견고",	"특성30상세" : "",	"특성50" : "정신 하강 공격",	"특성50상세" : "",	"특성70" : "일치단결",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "기주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "35",	},
        {	"이름" : "진군",	"병종" : "풍수사",	"코스트" : 8,	"계보" : "문소황후의 패",	"무력" : 26,	"지력" : 90,	"통솔력" : 71,	"순발력" : 68,	"행운" : 96,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "사신 소환",	"특성30상세" : "",	"특성50" : "회심 공격 면역",	"특성50상세" : "",	"특성70" : "주위 각성",	"특성70상세" : "",	"특성90" : "방어 능력 전환",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "28",	},
        {	"이름" : "견희",	"병종" : "무희",	"코스트" : 9,	"계보" : "문소황후의 패",	"무력" : 62,	"지력" : 73,	"통솔력" : 71,	"순발력" : 99,	"행운" : 91,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "MP 공격",	"특성30상세" : "",	"특성50" : "돌파 공격",	"특성50상세" : "",	"특성70" : "피해 범위 변경",	"특성70상세" : "2격",	"특성90" : "돌진 공격%",	"특성90상세" : "4",	"태수효과" : "징세의 달인",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "6",	},
        {	"이름" : "황호",	"병종" : "도사",	"코스트" : 4,	"계보" : "와룡공명의 패",	"무력" : 23,	"지력" : 30,	"통솔력" : 21,	"순발력" : 10,	"행운" : 22,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "상태이상 반사",	"특성30상세" : "",	"특성50" : "주위 압박",	"특성50상세" : "",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "전 방어율 증가",	"특성90상세" : "7",	"태수효과" : "제재소",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "115",	},
        {	"이름" : "유선",	"병종" : "보병",	"코스트" : 4,	"계보" : "와룡공명의 패",	"무력" : 34,	"지력" : 48,	"통솔력" : 56,	"순발력" : 67,	"행운" : 86,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 증가",	"특성30상세" : "15",	"특성50" : "주위 아박",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "95",	},
        {	"이름" : "비의",	"병종" : "풍수사",	"코스트" : 6,	"계보" : "와룡공명의 패",	"무력" : 40,	"지력" : 84,	"통솔력" : 82,	"순발력" : 70,	"행운" : 74,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "15",	"특성50" : "물리 피해 감소%",	"특성50상세" : "10",	"특성70" : "사신 소환",	"특성70상세" : "",	"특성90" : "주위 기합",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "청주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "50",	},
        {	"이름" : "제갈균",	"병종" : "궁병",	"코스트" : 4,	"계보" : "와룡공명의 패",	"무력" : 52,	"지력" : 69,	"통솔력" : 45,	"순발력" : 66,	"행운" : 72,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "본대 연병",	"특성30상세" : "",	"특성50" : "혼란 공격%",	"특성50상세" : "15",	"특성70" : "중독 공격%",	"특성70상세" : "15",	"특성90" : "지원 공격",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "40",	},
        {	"이름" : "곽익",	"병종" : "창병",	"코스트" : 7,	"계보" : "와룡공명의 패",	"무력" : 69,	"지력" : 69,	"통솔력" : 73,	"순발력" : 79,	"행운" : 88,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "주위 견고",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "형주(북) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "42",	},
        {	"이름" : "등지",	"병종" : "노병",	"코스트" : 8,	"계보" : "와룡공명의 패",	"무력" : 69,	"지력" : 82,	"통솔력" : 77,	"순발력" : 65,	"행운" : 82,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "공격 방어율 관통",	"특성70상세" : "10",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "28",	},
        {	"이름" : "제갈첨",	"병종" : "창병",	"코스트" : 6,	"계보" : "와룡공명의 패",	"무력" : 68,	"지력" : 76,	"통솔력" : 78,	"순발력" : 72,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "주위 둔병",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "48",	},
        {	"이름" : "하후패",	"병종" : "중기병",	"코스트" : 9,	"계보" : "와룡공명의 패",	"무력" : 87,	"지력" : 76,	"통솔력" : 85,	"순발력" : 72,	"행운" : 64,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 관통",	"특성30상세" : "10",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "책략 피해 감소%",	"특성70상세" : "15",	"특성90" : "본대 강행",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "익주(남) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "19",	},
        {	"이름" : "관흥",	"병종" : "중기병",	"코스트" : 9,	"계보" : "와룡공명의 패",	"무력" : 86,	"지력" : 67,	"통솔력" : 76,	"순발력" : 62,	"행운" : 82,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "공격 방어율 관통",	"특성50상세" : "10",	"특성70" : "책략 피해 감소%",	"특성70상세" : "15",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "형주(남) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "23",	},
        {	"이름" : "강유",	"병종" : "산악기병",	"코스트" : 11,	"계보" : "와룡공명의 패",	"무력" : 89,	"지력" : 90,	"통솔력" : 92,	"순발력" : 79,	"행운" : 64,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "선제 공격 면역",	"특성30상세" : "",	"특성50" : "일기당천",	"특성50상세" : "",	"특성70" : "기습 공격",	"특성70상세" : "4",	"특성90" : "책략 파쇄%",	"특성90상세" : "80",	"태수효과" : "징세의 달인",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "20",	},
        {	"이름" : "장빈",	"병종" : "궁병",	"코스트" : 4,	"계보" : "와룡공명의 패",	"무력" : 57,	"지력" : 79,	"통솔력" : 76,	"순발력" : 68,	"행운" : 70,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "순발력 하강 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "기주 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "38",	},
        {	"이름" : "동궐",	"병종" : "포차",	"코스트" : 4,	"계보" : "와룡공명의 패",	"무력" : 68,	"지력" : 75,	"통솔력" : 72,	"순발력" : 51,	"행운" : 72,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "공격 명중률 증가",	"특성70상세" : "20",	"특성90" : "본대 연병",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "138",	},
        {	"이름" : "장익",	"병종" : "보병",	"코스트" : 7,	"계보" : "와룡공명의 패",	"무력" : 74,	"지력" : 76,	"통솔력" : 75,	"순발력" : 74,	"행운" : 62,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 증가",	"특성30상세" : "15",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(중) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "40",	},
        {	"이름" : "여개",	"병종" : "노병",	"코스트" : 6,	"계보" : "와룡공명의 패",	"무력" : 68,	"지력" : 76,	"통솔력" : 78,	"순발력" : 59,	"행운" : 72,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "본대 고양",	"특성30상세" : "",	"특성50" : "혼란 공격%",	"특성50상세" : "15",	"특성70" : "책략 피해 감소%",	"특성70상세" : "10",	"특성90" : "무제한 반격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "익주(남) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "55",	},
        {	"이름" : "요화",	"병종" : "적병",	"코스트" : 9,	"계보" : "와룡공명의 패",	"무력" : 80,	"지력" : 69,	"통솔력" : 76,	"순발력" : 68,	"행운" : 82,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "공격 방어율 관통",	"특성30상세" : "10",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "형주(북) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "20",	},
        {	"이름" : "진밀",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "와룡공명의 패",	"무력" : 26,	"지력" : 73,	"통솔력" : 81,	"순발력" : 71,	"행운" : 73,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "9",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "주위 각성",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "익주(북) 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "101",	},
        {	"이름" : "양의",	"병종" : "노병",	"코스트" : 5,	"계보" : "와룡공명의 패",	"무력" : 68,	"지력" : 82,	"통솔력" : 73,	"순발력" : 56,	"행운" : 78,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "연속 공격 강화%",	"특성30상세" : "15",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "형주(북) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "59",	},
        {	"이름" : "장완",	"병종" : "책사",	"코스트" : 7,	"계보" : "와룡공명의 패",	"무력" : 42,	"지력" : 87,	"통솔력" : 74,	"순발력" : 58,	"행운" : 93,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "공격 책략 강화%",	"특성30상세" : "10",	"특성50" : "책략 모방",	"특성50상세" : "",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "상태이상 반사",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "형주(남) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "39",	},
        {	"이름" : "마속",	"병종" : "책사",	"코스트" : 6,	"계보" : "와룡공명의 패",	"무력" : 74,	"지력" : 87,	"통솔력" : 80,	"순발력" : 74,	"행운" : 66,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "공격 책략 강화%",	"특성50상세" : "10",	"특성70" : "연속 책략 강화",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "43",	},
        {	"이름" : "황월영",	"병종" : "책사",	"코스트" : 7,	"계보" : "와룡공명의 패",	"무력" : 71,	"지력" : 91,	"통솔력" : 63,	"순발력" : 67,	"행운" : 82,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "사신 소환",	"특성30상세" : "",	"특성50" : "MP 절약%",	"특성50상세" : "12",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "방어 능력 전환",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "30",	},
        {	"이름" : "제갈량",	"병종" : "현자",	"코스트" : 11,	"계보" : "와룡공명의 패",	"무력" : 34,	"지력" : 100,	"통솔력" : 98,	"순발력" : 77,	"행운" : 96,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "주위상",	"특성30상세" : "",	"특성50" : "귀모",	"특성50상세" : "",	"특성70" : "상태이상 면역",	"특성70상세" : "",	"특성90" : "와룡",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "전 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "3",	},
        {	"이름" : "사마랑",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "문명황후의 패",	"무력" : 32,	"지력" : 79,	"통솔력" : 52,	"순발력" : 66,	"행운" : 68,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 방어율 증가",	"특성30상세" : "10",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "9",	"특성70" : "책략 방어율 증가",	"특성70상세" : "15",	"특성90" : "주위 각성",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "교주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "87",	},
        {	"이름" : "하후휘",	"병종" : "도사",	"코스트" : 4,	"계보" : "문명황후의 패",	"무력" : 35,	"지력" : 79,	"통솔력" : 62,	"순발력" : 77,	"행운" : 68,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "주위 압박",	"특성50상세" : "",	"특성70" : "상태이상 반사",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "사주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "85",	},
        {	"이름" : "관구검",	"병종" : "산악기병",	"코스트" : 6,	"계보" : "문명황후의 패",	"무력" : 74,	"지력" : 55,	"통솔력" : 77,	"순발력" : 66,	"행운" : 72,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 압박",	"특성30상세" : "",	"특성50" : "기마 공격 강화 무시",	"특성50상세" : "",	"특성70" : "돌진 공격%",	"특성70상세" : "3",	"특성90" : "연속 공격 강화%",	"특성90상세" : "15",	"태수효과" : "경작",	"군주효과" : "사주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "98",	},
        {	"이름" : "황보숭",	"병종" : "보병",	"코스트" : 9,	"계보" : "문명황후의 패",	"무력" : 74,	"지력" : 72,	"통솔력" : 93,	"순발력" : 63,	"행운" : 66,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 증가",	"특성30상세" : "15",	"특성50" : "책략 방어율 증가",	"특성50상세" : "15",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "기주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "11",	},
        {	"이름" : "왕쌍",	"병종" : "무인",	"코스트" : 9,	"계보" : "문명황후의 패",	"무력" : 89,	"지력" : 28,	"통솔력" : 69,	"순발력" : 91,	"행운" : 62,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "혼란 공격%",	"특성50상세" : "30",	"특성70" : "회심 공격",	"특성70상세" : "",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "옹주(동) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "35",	},
        {	"이름" : "하후현",	"병종" : "책사",	"코스트" : 7,	"계보" : "문명황후의 패",	"무력" : 46,	"지력" : 89,	"통솔력" : 69,	"순발력" : 65,	"행운" : 88,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "사신 소환",	"특성30상세" : "",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "연속 책략 강화",	"특성70상세" : "",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "기주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "36",	},
        {	"이름" : "사마염",	"병종" : "군주",	"코스트" : 7,	"계보" : "문명황후의 패",	"무력" : 64,	"지력" : 80,	"통솔력" : 79,	"순발력" : 78,	"행운" : 78,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "주위 고양",	"특성30상세" : "",	"특성50" : "본대 패기",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "무반격 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "사주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "37",	},
        {	"이름" : "사마소",	"병종" : "군주",	"코스트" : 7,	"계보" : "문명황후의 패",	"무력" : 72,	"지력" : 82,	"통솔력" : 76,	"순발력" : 77,	"행운" : 70,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "주위 집중",	"특성50상세" : "",	"특성70" : "일치단결",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "사주",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "43",	},
        {	"이름" : "장춘화",	"병종" : "도사",	"코스트" : 6,	"계보" : "문명황후의 패",	"무력" : 58,	"지력" : 88,	"통솔력" : 66,	"순발력" : 82,	"행운" : 69,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 모방",	"특성30상세" : "",	"특성50" : "무제한 반격",	"특성50상세" : "",	"특성70" : "MP 공격",	"특성70상세" : "",	"특성90" : "공격 능력 전환",	"특성90상세" : "",	"태수효과" : "보관의 달인",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "42",	},
        {	"이름" : "모개",	"병종" : "노병",	"코스트" : 5,	"계보" : "문명황후의 패",	"무력" : 65,	"지력" : 75,	"통솔력" : 70,	"순발력" : 58,	"행운" : 74,	"무기종류" : "노",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "정신력 하강 공격",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "61",	},
        {	"이름" : "하후화",	"병종" : "보병",	"코스트" : 5,	"계보" : "문명황후의 패",	"무력" : 62,	"지력" : 74,	"통솔력" : 71,	"순발력" : 68,	"행운" : 70,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 증가",	"특성30상세" : "15",	"특성50" : "주위 저지",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "옹주(동) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "68",	},
        {	"이름" : "양제",	"병종" : "창병",	"코스트" : 6,	"계보" : "문명황후의 패",	"무력" : 69,	"지력" : 72,	"통솔력" : 73,	"순발력" : 66,	"행운" : 75,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "주위 둔병",	"특성30상세" : "",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "주위 압박",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "사주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "52",	},
        {	"이름" : "양수",	"병종" : "책사",	"코스트" : 5,	"계보" : "문명황후의 패",	"무력" : 26,	"지력" : 87,	"통솔력" : 49,	"순발력" : 62,	"행운" : 68,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "원소 책략 강화%",	"특성30상세" : "5",	"특성50" : "주위 연병",	"특성50상세" : "",	"특성70" : "책략 피해 반사%",	"특성70상세" : "10",	"특성90" : "상태이상 면역",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "사주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "55",	},
        {	"이름" : "가남풍",	"병종" : "도사",	"코스트" : 6,	"계보" : "문명황후의 패",	"무력" : 65,	"지력" : 86,	"통솔력" : 59,	"순발력" : 68,	"행운" : 72,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "물리 피해 감소%",	"특성50상세" : "10",	"특성70" : "상태이상 반사",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "교주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "47",	},
        {	"이름" : "하후상",	"병종" : "궁기병",	"코스트" : 8,	"계보" : "문명황후의 패",	"무력" : 76,	"지력" : 78,	"통솔력" : 83,	"순발력" : 61,	"행운" : 77,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 관통",	"특성30상세" : "10",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "무제한 반격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "병주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "65",	},
        {	"이름" : "왕기",	"병종" : "경기병",	"코스트" : 8,	"계보" : "문명황후의 패",	"무력" : 82,	"지력" : 76,	"통솔력" : 83,	"순발력" : 74,	"행운" : 66,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "회심 공격 강화",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "간접 피해 감소%",	"특성90상세" : "10",	"태수효과" : "항만",	"군주효과" : "청주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "57",	},
        {	"이름" : "두예",	"병종" : "도독",	"코스트" : 8,	"계보" : "문명황후의 패",	"무력" : 52,	"지력" : 87,	"통솔력" : 89,	"순발력" : 67,	"행운" : 81,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "원소 책략 강화%",	"특성30상세" : "5",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "MP 공격",	"특성70상세" : "",	"특성90" : "돌진 공격%",	"특성90상세" : "4",	"태수효과" : "제재소",	"군주효과" : "교주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "106",	},
        {	"이름" : "사마사",	"병종" : "군주",	"코스트" : 7,	"계보" : "문명황후의 패",	"무력" : 69,	"지력" : 89,	"통솔력" : 83,	"순발력" : 66,	"행운" : 79,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "방어력 보조%",	"특성30상세" : "10",	"특성50" : "주위 기합",	"특성50상세" : "",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "상태이상 반사",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "36",	},
        {	"이름" : "양휘유",	"병종" : "무희",	"코스트" : 7,	"계보" : "문명황후의 패",	"무력" : 65,	"지력" : 65,	"통솔력" : 72,	"순발력" : 86,	"행운" : 75,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "무작위 하강 공격",	"특성30상세" : "",	"특성50" : "공격 범위 변경",	"특성50상세" : "몰우전",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "MP 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "17",	},
        {	"이름" : "양지",	"병종" : "책사",	"코스트" : 5,	"계보" : "문명황후의 패",	"무력" : 25,	"지력" : 82,	"통솔력" : 62,	"순발력" : 67,	"행운" : 71,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "MP 공격",	"특성50상세" : "",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "65",	},
        {	"이름" : "왕원희",	"병종" : "무희",	"코스트" : 10,	"계보" : "문명황후의 패",	"무력" : 81,	"지력" : 88,	"통솔력" : 66,	"순발력" : 82,	"행운" : 95,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "간접 피해 감소%",	"특성30상세" : "70",	"특성50" : "선제 공격",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "5",	},
        {	"이름" : "조성",	"병종" : "궁기병",	"코스트" : 4,	"계보" : "비장봉선의 패",	"무력" : 74,	"지력" : 37,	"통솔력" : 65,	"순발력" : 61,	"행운" : 75,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "반격 강화",	"특성30상세" : "",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "회심 공격 강화",	"특성70상세" : "",	"특성90" : "순발력 하강 공격",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "병주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "126",	},
        {	"이름" : "이각",	"병종" : "보병",	"코스트" : 6,	"계보" : "비장봉선의 패",	"무력" : 73,	"지력" : 44,	"통솔력" : 71,	"순발력" : 71,	"행운" : 59,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "주위 저지",	"특성50상세" : "",	"특성70" : "책략 방어율 증가",	"특성70상세" : "15",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "56",	},
        {	"이름" : "번조",	"병종" : "중기병",	"코스트" : 4,	"계보" : "비장봉선의 패",	"무력" : 75,	"지력" : 45,	"통솔력" : 66,	"순발력" : 61,	"행운" : 80,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "본대 견고",	"특성30상세" : "",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 반사%",	"특성70상세" : "12",	"특성90" : "피해 범위 변경",	"특성90상세" : "2격",	"태수효과" : "군량 보관",	"군주효과" : "옹주(서) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "88",	},
        {	"이름" : "후성",	"병종" : "보병",	"코스트" : 4,	"계보" : "비장봉선의 패",	"무력" : 76,	"지력" : 68,	"통솔력" : 74,	"순발력" : 52,	"행운" : 54,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "HP 보조%",	"특성30상세" : "15",	"특성50" : "주위 허탈",	"특성50상세" : "",	"특성70" : "물리 피해 감소%",	"특성70상세" : "10",	"특성90" : "책략 방어율 증가",	"특성90상세" : "20",	"태수효과" : "견직",	"군주효과" : "서주 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "80",	},
        {	"이름" : "이숙",	"병종" : "도사",	"코스트" : 4,	"계보" : "비장봉선의 패",	"무력" : 69,	"지력" : 73,	"통솔력" : 46,	"순발력" : 72,	"행운" : 59,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "책략 피해 반사%",	"특성30상세" : "10",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "방해계 책략 강화%",	"특성70상세" : "10",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "100",	},
        {	"이름" : "위속",	"병종" : "경기병",	"코스트" : 4,	"계보" : "비장봉선의 패",	"무력" : 78,	"지력" : 42,	"통솔력" : 67,	"순발력" : 69,	"행운" : 58,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 방해",	"특성30상세" : "",	"특성50" : "반격 강화",	"특성50상세" : "",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "연속 공격 강화%",	"특성90상세" : "15",	"태수효과" : "시장",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "119",	},
        {	"이름" : "송헌",	"병종" : "궁병",	"코스트" : 4,	"계보" : "비장봉선의 패",	"무력" : 77,	"지력" : 38,	"통솔력" : 68,	"순발력" : 67,	"행운" : 60,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "중독 공격%",	"특성30상세" : "15",	"특성50" : "맹독 공격%",	"특성50상세" : "50",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "공격력 하강 공격",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "서주 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "39",	},
        {	"이름" : "곽사",	"병종" : "창병",	"코스트" : 5,	"계보" : "비장봉선의 패",	"무력" : 76,	"지력" : 33,	"통솔력" : 64,	"순발력" : 58,	"행운" : 74,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "주위 둔병",	"특성30상세" : "",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "기마 공격 강화%",	"특성70상세" : "15",	"특성90" : "주위 욕설",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "옹주(서) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "108",	},
        {	"이름" : "서영",	"병종" : "중기병",	"코스트" : 6,	"계보" : "비장봉선의 패",	"무력" : 75,	"지력" : 62,	"통솔력" : 80,	"순발력" : 67,	"행운" : 77,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 반사%",	"특성30상세" : "10",	"특성50" : "사기 하강 공격",	"특성50상세" : "",	"특성70" : "간접 피해 감소%",	"특성70상세" : "10",	"특성90" : "회심 공격 면역",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "옹주(서) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "45",	},
        {	"이름" : "장막",	"병종" : "경기병",	"코스트" : 7,	"계보" : "비장봉선의 패",	"무력" : 60,	"지력" : 70,	"통솔력" : 84,	"순발력" : 74,	"행운" : 72,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "연속 공격 강화%",	"특성50상세" : "15",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "물리 피해 감소%",	"특성90상세" : "10",	"태수효과" : "제재소",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "103",	},
        {	"이름" : "왕윤",	"병종" : "풍수사",	"코스트" : 5,	"계보" : "비장봉선의 패",	"무력" : 26,	"지력" : 83,	"통솔력" : 65,	"순발력" : 74,	"행운" : 76,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "8",	"특성50" : "간접 피해 감소%",	"특성50상세" : "10",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "주위 집중",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "병주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "63",	},
        {	"이름" : "수고",	"병종" : "적병",	"코스트" : 6,	"계보" : "비장봉선의 패",	"무력" : 74,	"지력" : 38,	"통솔력" : 67,	"순발력" : 71,	"행운" : 82,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "지계 책략 강화%",	"특성30상세" : "10",	"특성50" : "사기 보조%",	"특성50상세" : "10",	"특성70" : "공격력 보조%",	"특성70상세" : "13",	"특성90" : "연속 공격 면역",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "41",	},
        {	"이름" : "이유",	"병종" : "책사",	"코스트" : 5,	"계보" : "비장봉선의 패",	"무력" : 50,	"지력" : 93,	"통솔력" : 68,	"순발력" : 69,	"행운" : 75,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "공격 책략 강화%",	"특성50상세" : "10",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "사주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "53",	},
        {	"이름" : "호진",	"병종" : "중기병",	"코스트" : 4,	"계보" : "비장봉선의 패",	"무력" : 77,	"지력" : 34,	"통솔력" : 86,	"순발력" : 68,	"행운" : 82,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "순발력 하강 공격",	"특성50상세" : "",	"특성70" : "물리 피해 반사%",	"특성70상세" : "12",	"특성90" : "분노 축적%",	"특성90상세" : "20",	"태수효과" : "경작",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "62",	},
        {	"이름" : "장패",	"병종" : "적병",	"코스트" : 9,	"계보" : "비장봉선의 패",	"무력" : 80,	"지력" : 53,	"통솔력" : 75,	"순발력" : 72,	"행운" : 90,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "지계 책략 강화%",	"특성30상세" : "10",	"특성50" : "사기 보조%",	"특성50상세" : "10",	"특성70" : "본대 고양",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "옹주(서) 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "15",	},
        {	"이름" : "여령기",	"병종" : "경기병",	"코스트" : 9,	"계보" : "비장봉선의 패",	"무력" : 85,	"지력" : 33,	"통솔력" : 62,	"순발력" : 88,	"행운" : 75,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "돌파 공격",	"특성30상세" : "",	"특성50" : "지형 효과 보조",	"특성50상세" : "",	"특성70" : "물리 공격 강화%",	"특성70상세" : "12",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "40",	},
        {	"이름" : "고순",	"병종" : "전차",	"코스트" : 9,	"계보" : "비장봉선의 패",	"무력" : 85,	"지력" : 60,	"통솔력" : 87,	"순발력" : 62,	"행운" : 78,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "돌진 공격%",	"특성30상세" : "2",	"특성50" : "주위 욕설",	"특성50상세" : "",	"특성70" : "방어력 보조%",	"특성70상세" : "13",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "병주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "102",	},
        {	"이름" : "진궁",	"병종" : "책사",	"코스트" : 7,	"계보" : "비장봉선의 패",	"무력" : 68,	"지력" : 89,	"통솔력" : 84,	"순발력" : 62,	"행운" : 92,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "회심 공격 면역",	"특성30상세" : "",	"특성50" : "공격 책략 강화%",	"특성50상세" : "10",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "병주 약탈",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "35",	},
        {	"이름" : "화웅",	"병종" : "전차",	"코스트" : 10,	"계보" : "비장봉선의 패",	"무력" : 92,	"지력" : 61,	"통솔력" : 88,	"순발력" : 76,	"행운" : 54,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "방어력 보조%",	"특성50상세" : "11",	"특성70" : "돌파 공격",	"특성70상세" : "",	"특성90" : "피해 전가",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "152",	},
        {	"이름" : "동탁",	"병종" : "전차",	"코스트" : 12,	"계보" : "비장봉선의 패",	"무력" : 87,	"지력" : 73,	"통솔력" : 90,	"순발력" : 67,	"행운" : 91,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "선제 공격 면역",	"특성30상세" : "",	"특성50" : "기습 공격 %",	"특성50상세" : "3",	"특성70" : "돌파 공격",	"특성70상세" : "",	"특성90" : "돌진 공격%",	"특성90상세" : "4",	"태수효과" : "징세의 달인",	"군주효과" : "전 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "82",	},
        {	"이름" : "여포",	"병종" : "산악기병",	"코스트" : 14,	"계보" : "비장봉선의 패",	"무력" : 100,	"지력" : 26,	"통솔력" : 97,	"순발력" : 93,	"행운" : 85,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "주위 압박",	"특성30상세" : "",	"특성50" : "돌파 공격",	"특성50상세" : "",	"특성70" : "연환 공격",	"특성70상세" : "",	"특성90" : "간접 공격 면역",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "2",	},
        {	"이름" : "사준",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "발탁무장의 패",	"무력" : 30,	"지력" : 70,	"통솔력" : 30,	"순발력" : 60,	"행운" : 60,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "주위 각성",	"특성30상세" : "",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "9",	"특성70" : "MP 보조%",	"특성70상세" : "15",	"특성90" : "간접 피해 감소%",	"특성90상세" : "20",	"태수효과" : "수산물",	"군주효과" : "형주(남) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "104",	},
        {	"이름" : "곽진",	"병종" : "창병",	"코스트" : 4,	"계보" : "발탁무장의 패",	"무력" : 60,	"지력" : 50,	"통솔력" : 60,	"순발력" : 50,	"행운" : 50,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "주위 둔병",	"특성30상세" : "",	"특성50" : "무작위 하강 공격",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "주위 방해",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "146",	},
        {	"이름" : "이래",	"병종" : "책사",	"코스트" : 4,	"계보" : "발탁무장의 패",	"무력" : 40,	"지력" : 70,	"통솔력" : 50,	"순발력" : 50,	"행운" : 50,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "화계 책략 강화%",	"특성50상세" : "15",	"특성70" : "원소 책략 강화%",	"특성70상세" : "5",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "서주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "103",	},
        {	"이름" : "경무",	"병종" : "산악기병",	"코스트" : 4,	"계보" : "발탁무장의 패",	"무력" : 60,	"지력" : 50,	"통솔력" : 50,	"순발력" : 60,	"행운" : 50,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "순발력 보조%",	"특성50상세" : "10",	"특성70" : "돌진 공격%",	"특성70상세" : "4",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "옹주(서) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "145",	},
        {	"이름" : "장백",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "발탁무장의 패",	"무력" : 30,	"지력" : 70,	"통솔력" : 30,	"순발력" : 60,	"행운" : 60,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "전 방어율 증가",	"특성30상세" : "7",	"특성50" : "보급계 책략 강화%",	"특성50상세" : "9",	"특성70" : "간접 피해 감소%",	"특성70상세" : "10",	"특성90" : "주위 집중",	"특성90상세" : "",	"태수효과" : "절대 보호",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "105",	},
        {	"이름" : "양진",	"병종" : "무인",	"코스트" : 4,	"계보" : "발탁무장의 패",	"무력" : 60,	"지력" : 30,	"통솔력" : 60,	"순발력" : 70,	"행운" : 50,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "본대 연병",	"특성30상세" : "",	"특성50" : "공격력 하강 공격",	"특성50상세" : "",	"특성70" : "반격 강화",	"특성70상세" : "",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "144",	},
        {	"이름" : "가환",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "발탁무장의 패",	"무력" : 30,	"지력" : 70,	"통솔력" : 30,	"순발력" : 60,	"행운" : 60,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "8",	"특성50" : "MP 보조%",	"특성50상세" : "13",	"특성70" : "간접 피해 감소%",	"특성70상세" : "10",	"특성90" : "주위 연병",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "106",	},
        {	"이름" : "방선",	"병종" : "포차",	"코스트" : 4,	"계보" : "발탁무장의 패",	"무력" : 60,	"지력" : 70,	"통솔력" : 50,	"순발력" : 40,	"행운" : 60,	"무기종류" : "포",	"갑옷종류" : "전포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "공격 명중률 증가",	"특성50상세" : "17",	"특성70" : "무작위 하강 공격",	"특성70상세" : "",	"특성90" : "본대 연병",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(북) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "143",	},
        {	"이름" : "유화",	"병종" : "풍수사",	"코스트" : 4,	"계보" : "발탁무장의 패",	"무력" : 30,	"지력" : 70,	"통솔력" : 30,	"순발력" : 60,	"행운" : 60,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "간접 피해 감소%",	"특성30상세" : "10",	"특성50" : "MP 보조%",	"특성50상세" : "13",	"특성70" : "보급계 책략 강화%",	"특성70상세" : "10",	"특성90" : "주위 각성",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "유주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "107",	},
        {	"이름" : "하후돈",	"병종" : "검사",	"코스트" : 11,	"계보" : "풍운아만의 패",	"무력" : 98,	"지력" : 64,	"통솔력" : 82,	"순발력" : 90,	"행운" : 66,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "공격 방어율 관통",	"특성30상세" : "15",	"특성50" : "전화위복",	"특성50상세" : "",	"특성70" : "주동 공격",	"특성70상세" : "",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "이주 약탈",	"별칭" : "검후돈",	"추천병종" : "사격훈련부",	"추천병종순" : "5",	},
        {	"이름" : "변월향",	"병종" : "군악대",	"코스트" : 6,	"계보" : "풍운아만의 패",	"무력" : 43,	"지력" : 88,	"통솔력" : 69,	"순발력" : 97,	"행운" : 83,	"무기종류" : "선",	"갑옷종류" : "전포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "험로 이동",	"특성50상세" : "",	"특성70" : "범위 책략 피해 감소",	"특성70상세" : "70",	"특성90" : "주위 강행",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "전 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "16",	},
        {	"이름" : "조조",	"병종" : "검사",	"코스트" : 14,	"계보" : "풍운아만의 패",	"무력" : 82,	"지력" : 92,	"통솔력" : 98,	"순발력" : 80,	"행운" : 84,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "구사일생",	"특성30상세" : "",	"특성50" : "마무리 일격",	"특성50상세" : "",	"특성70" : "권토중래",	"특성70상세" : "",	"특성90" : "재반격",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "출진 군량",	"별칭" : "아만",	"추천병종" : "사격훈련부",	"추천병종순" : "1",	},
        {	"이름" : "관영",	"병종" : "경기병",	"코스트" : 10,	"계보" : "태조고제의 패",	"무력" : 95,	"지력" : 39,	"통솔력" : 71,	"순발력" : 92,	"행운" : 88,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "무반격 공격",	"특성30상세" : "",	"특성50" : "물리 공격 강화%",	"특성50상세" : "12",	"특성70" : "공격 범위 변경",	"특성70상세" : "대폭염",	"특성90" : "갈퀴 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "24",	},
        {	"이름" : "왕릉",	"병종" : "전차",	"코스트" : 10,	"계보" : "태조고제의 패",	"무력" : 93,	"지력" : 85,	"통솔력" : 82,	"순발력" : 72,	"행운" : 86,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "돌진 공격%",	"특성30상세" : "3",	"특성50" : "연속 책략 면역",	"특성50상세" : "",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "파진 공격",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "150",	},
        {	"이름" : "진평",	"병종" : "도사",	"코스트" : 9,	"계보" : "태조고제의 패",	"무력" : 13,	"지력" : 97,	"통솔력" : 67,	"순발력" : 82,	"행운" : 93,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "15",	"특성50" : "책략 방어율 관통",	"특성50상세" : "10",	"특성70" : "회심 공격 면역",	"특성70상세" : "",	"특성90" : "방어 능력 전환",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "12",	},
        {	"이름" : "여치",	"병종" : "무희",	"코스트" : 11,	"계보" : "태조고제의 패",	"무력" : 81,	"지력" : 66,	"통솔력" : 73,	"순발력" : 95,	"행운" : 89,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "무반격 공격",	"특성30상세" : "",	"특성50" : "연속 반격",	"특성50상세" : "",	"특성70" : "혼란 공격%",	"특성70상세" : "30",	"특성90" : "선제 공격 면역",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "이주 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "3",	},
        {	"이름" : "팽월",	"병종" : "산악기병",	"코스트" : 10,	"계보" : "태조고제의 패",	"무력" : 91,	"지력" : 35,	"통솔력" : 86,	"순발력" : 98,	"행운" : 61,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "수전 보조",	"특성30상세" : "",	"특성50" : "돌진 공격%",	"특성50상세" : "4",	"특성70" : "기습 공격",	"특성70상세" : "",	"특성90" : "돌격 이동",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "청주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "25",	},
        {	"이름" : "주발",	"병종" : "궁기병",	"코스트" : 10,	"계보" : "태조고제의 패",	"무력" : 86,	"지력" : 51,	"통솔력" : 88,	"순발력" : 81,	"행운" : 85,	"무기종류" : "궁",	"갑옷종류" : "갑옷",	"특성30" : "회심 공격 강화",	"특성30상세" : "",	"특성50" : "일기당천",	"특성50상세" : "",	"특성70" : "일격 필살",	"특성70상세" : "",	"특성90" : "인도 공격",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "예주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "30",	},
        {	"이름" : "조참",	"병종" : "중기병",	"코스트" : 12,	"계보" : "태조고제의 패",	"무력" : 92,	"지력" : 87,	"통솔력" : 92,	"순발력" : 83,	"행운" : 89,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "공격 범위 변경",	"특성30상세" : "",	"특성50" : "일격 필살",	"특성50상세" : "",	"특성70" : "역전용사",	"특성70상세" : "",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "양돈",	"군주효과" : "예주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "2",	},
        {	"이름" : "하후영",	"병종" : "노전차",	"코스트" : 11,	"계보" : "태조고제의 패",	"무력" : 85,	"지력" : 57,	"통솔력" : 84,	"순발력" : 92,	"행운" : 78,	"무기종류" : "노",	"갑옷종류" : "갑옷",	"특성30" : "본대 강행",	"특성30상세" : "",	"특성50" : "일기당천",	"특성50상세" : "",	"특성70" : "연속 책략 면역",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "9",	},
        {	"이름" : "소하",	"병종" : "풍수사",	"코스트" : 9,	"계보" : "태조고제의 패",	"무력" : 6,	"지력" : 96,	"통솔력" : 87,	"순발력" : 73,	"행운" : 69,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "회심 공격 면역",	"특성30상세" : "",	"특성50" : "주위 집중",	"특성50상세" : "",	"특성70" : "주위 강행",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "14",	},
        {	"이름" : "번쾌",	"병종" : "검사",	"코스트" : 13,	"계보" : "태조고제의 패",	"무력" : 97,	"지력" : 45,	"통솔력" : 85,	"순발력" : 86,	"행운" : 84,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "신출귀몰",	"특성30상세" : "10",	"특성50" : "책략 방어율 관통",	"특성50상세" : "15",	"특성70" : "회심 공격 면역",	"특성70상세" : "",	"특성90" : "연속 책략",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "전 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "2",	},
        {	"이름" : "한신",	"병종" : "도독",	"코스트" : 14,	"계보" : "태조고제의 패",	"무력" : 84,	"지력" : 98,	"통솔력" : 100,	"순발력" : 89,	"행운" : 49,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "산전 특화",	"특성30상세" : "",	"특성50" : "국사무쌍%",	"특성50상세" : "",	"특성70" : "특수 공격 면역",	"특성70상세" : "",	"특성90" : "다다익선",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "이주 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "43",	},
        {	"이름" : "장량",	"병종" : "현자",	"코스트" : 14,	"계보" : "태조고제의 패",	"무력" : 39,	"지력" : 100,	"통솔력" : 75,	"순발력" : 82,	"행운" : 90,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "간접 피해 감소%",	"특성50상세" : "70",	"특성70" : "신기묘산",	"특성70상세" : "",	"특성90" : "귀문",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "1",	},
        {	"이름" : "유방",	"병종" : "천자",	"코스트" : 9,	"계보" : "태조고제의 패",	"무력" : 77,	"지력" : 81,	"통솔력" : 89,	"순발력" : 90,	"행운" : 100,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "사기 보조%",	"특성30상세" : "30",	"특성50" : "주위 연병",	"특성50상세" : "",	"특성70" : "주위 기합",	"특성70상세" : "",	"특성90" : "구사일생",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "전 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "7",	},
        {	"이름" : "항백",	"병종" : "풍수사",	"코스트" : 5,	"계보" : "패왕항우의 패",	"무력" : 67,	"지력" : 76,	"통솔력" : 81,	"순발력" : 63,	"행운" : 73,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "상태이상 면역",	"특성30상세" : "",	"특성50" : "물리 피해 감소%",	"특성50상세" : "10",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "점령",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "74",	},
        {	"이름" : "항량",	"병종" : "군주",	"코스트" : 7,	"계보" : "패왕항우의 패",	"무력" : 85,	"지력" : 54,	"통솔력" : 96,	"순발력" : 59,	"행운" : 65,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "HP 보조%",	"특성30상세" : "15",	"특성50" : "연속 책략 면역",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "선제 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "이주 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "52",	},
        {	"이름" : "우영",	"병종" : "무인",	"코스트" : 10,	"계보" : "패왕항우의 패",	"무력" : 90,	"지력" : 47,	"통솔력" : 81,	"순발력" : 96,	"행운" : 78,	"무기종류" : "곤",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "일격 필살",	"특성50상세" : "",	"특성70" : "일기당천",	"특성70상세" : "",	"특성90" : "전 방어율 증가",	"특성90상세" : "20",	"태수효과" : "시장",	"군주효과" : "사주 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "26",	},
        {	"이름" : "환초",	"병종" : "적병",	"코스트" : 11,	"계보" : "패왕항우의 패",	"무력" : 95,	"지력" : 39,	"통솔력" : 79,	"순발력" : 92,	"행운" : 76,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "돌격 이동",	"특성30상세" : "",	"특성50" : "권토중래",	"특성50상세" : "",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "연속 공격 강화%",	"특성90상세" : "50",	"태수효과" : "양돈",	"군주효과" : "전 약탈",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "11",	},
        {	"이름" : "주란",	"병종" : "궁병",	"코스트" : 10,	"계보" : "패왕항우의 패",	"무력" : 91,	"지력" : 77,	"통솔력" : 79,	"순발력" : 85,	"행운" : 98,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "금책 공격%",	"특성30상세" : "30",	"특성50" : "지원 공격",	"특성50상세" : "",	"특성70" : "피해 범위 변경",	"특성70상세" : "2격",	"특성90" : "금격 공격%",	"특성90상세" : "30",	"태수효과" : "수산물",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "9",	},
        {	"이름" : "계포",	"병종" : "창병",	"코스트" : 10,	"계보" : "패왕항우의 패",	"무력" : 89,	"지력" : 58,	"통솔력" : 91,	"순발력" : 71,	"행운" : 77,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "방어력 보조%",	"특성30상세" : "10",	"특성50" : "계포일낙",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "갈퀴 공격",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "9",	},
        {	"이름" : "용저",	"병종" : "효기병",	"코스트" : 12,	"계보" : "패왕항우의 패",	"무력" : 97,	"지력" : 37,	"통솔력" : 78,	"순발력" : 83,	"행운" : 79,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "돌진 공격%",	"특성30상세" : "5",	"특성50" : "험로 이동",	"특성50상세" : "",	"특성70" : "기습 공격",	"특성70상세" : "3",	"특성90" : "주동 공격",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "양주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "10",	},
        {	"이름" : "종리말",	"병종" : "노전차",	"코스트" : 13,	"계보" : "패왕항우의 패",	"무력" : 93,	"지력" : 81,	"통솔력" : 84,	"순발력" : 97,	"행운" : 88,	"무기종류" : "노",	"갑옷종류" : "갑옷",	"특성30" : "신출귀몰",	"특성30상세" : "10",	"특성50" : "수전 보조",	"특성50상세" : "",	"특성70" : "일격 필살",	"특성70상세" : "",	"특성90" : "돌격 이동",	"특성90상세" : "",	"태수효과" : "공방",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "2",	},
        {	"이름" : "영포",	"병종" : "효기병",	"코스트" : 13,	"계보" : "패왕항우의 패",	"무력" : 96,	"지력" : 49,	"통솔력" : 86,	"순발력" : 77,	"행운" : 81,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "전화위복",	"특성30상세" : "",	"특성50" : "일기당천",	"특성50상세" : "",	"특성70" : "인도 공격",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "양주(북) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "5",	},
        {	"이름" : "범증",	"병종" : "책사",	"코스트" : 11,	"계보" : "패왕항우의 패",	"무력" : 37,	"지력" : 97,	"통솔력" : 88,	"순발력" : 80,	"행운" : 75,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 책략 강화",	"특성30상세" : "",	"특성50" : "연속 공격 면역",	"특성50상세" : "",	"특성70" : "책략 명중률 증가",	"특성70상세" : "15",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "6",	},
        {	"이름" : "우희",	"병종" : "군악대",	"코스트" : 4,	"계보" : "패왕항우의 패",	"무력" : 73,	"지력" : 69,	"통솔력" : 82,	"순발력" : 99,	"행운" : 78,	"무기종류" : "선",	"갑옷종류" : "전포",	"특성30" : "간접 피해 감소%",	"특성30상세" : "15",	"특성50" : "MP 절약%",	"특성50상세" : "25",	"특성70" : "물리 피해 감소%",	"특성70상세" : "15",	"특성90" : "주위 각성",	"특성90상세" : "",	"태수효과" : "수산물",	"군주효과" : "서주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "25",	},
        {	"이름" : "항적",	"병종" : "효기병",	"코스트" : 15,	"계보" : "패왕항우의 패",	"무력" : 100,	"지력" : 59,	"통솔력" : 99,	"순발력" : 90,	"행운" : 73,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "고금무쌍",	"특성30상세" : "",	"특성50" : "파부침주",	"특성50상세" : "",	"특성70" : "분전 공격",	"특성70상세" : "",	"특성90" : "역발산기개세",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "이주 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "1",	},
        {	"이름" : "곽여왕",	"병종" : "군주",	"코스트" : 9,	"계보" : "난세여걸의 패",	"무력" : 73,	"지력" : 85,	"통솔력" : 81,	"순발력" : 83,	"행운" : 89,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "방어력 보조%",	"특성30상세" : "10",	"특성50" : "피해 범위 변경",	"특성50상세" : "2격",	"특성70" : "견고의 일격%",	"특성70상세" : "50",	"특성90" : "기합의 일격%",	"특성90상세" : "50",	"태수효과" : "시장",	"군주효과" : "사주 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "16",	},
        {	"이름" : "장세연",	"병종" : "중기병",	"코스트" : 11,	"계보" : "난세여걸의 패",	"무력" : 85,	"지력" : 58,	"통솔력" : 83,	"순발력" : 88,	"행운" : 62,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "연속 반격",	"특성30상세" : "",	"특성50" : "인도 공격",	"특성50상세" : "",	"특성70" : "분노 축적%",	"특성70상세" : "20",	"특성90" : "역전용사",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "익주(중) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "8",	},
        {	"이름" : "조령",	"병종" : "군악대",	"코스트" : 5,	"계보" : "난세여걸의 패",	"무력" : 37,	"지력" : 73,	"통솔력" : 68,	"순발력" : 92,	"행운" : 83,	"무기종류" : "선",	"갑옷종류" : "전포",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "MP 절약%",	"특성50상세" : "25",	"특성70" : "회심 공격 면역",	"특성70상세" : "",	"특성90" : "주위 기합",	"특성90상세" : "",	"태수효과" : "견직",	"군주효과" : "전 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "22",	},
        {	"이름" : "강희",	"병종" : "창병",	"코스트" : 9,	"계보" : "난세여걸의 패",	"무력" : 80,	"지력" : 53,	"통솔력" : 78,	"순발력" : 85,	"행운" : 70,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(남) 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "49",	},
        {	"이름" : "정안",	"병종" : "적병",	"코스트" : 9,	"계보" : "난세여걸의 패",	"무력" : 81,	"지력" : 57,	"통솔력" : 80,	"순발력" : 89,	"행운" : 60,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "방어력 보조%",	"특성30상세" : "10",	"특성50" : "본대 강행",	"특성50상세" : "",	"특성70" : "전화위복",	"특성70상세" : "",	"특성90" : "피해 범위 변경",	"특성90상세" : "2격",	"태수효과" : "징세의 달인",	"군주효과" : "형주(북) 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "34",	},
        {	"이름" : "동백",	"병종" : "전차",	"코스트" : 7,	"계보" : "난세여걸의 패",	"무력" : 82,	"지력" : 65,	"통솔력" : 77,	"순발력" : 72,	"행운" : 89,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "지형 효과 보조",	"특성30상세" : "",	"특성50" : "기습 공격%",	"특성50상세" : "3",	"특성70" : "일격 필살",	"특성70상세" : "",	"특성90" : "돌진 공격%",	"특성90상세" : "3",	"태수효과" : "징세의 달인",	"군주효과" : "전 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "162",	},
        {	"이름" : "왕열",	"병종" : "보병",	"코스트" : 7,	"계보" : "난세여걸의 패",	"무력" : 91,	"지력" : 58,	"통솔력" : 63,	"순발력" : 78,	"행운" : 71,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "일치단결",	"특성50상세" : "",	"특성70" : "전 방어율 증가",	"특성70상세" : "7",	"특성90" : "전화위복",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "무역 상점",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "51",	},
        {	"이름" : "왕도",	"병종" : "궁병",	"코스트" : 6,	"계보" : "난세여걸의 패",	"무력" : 78,	"지력" : 64,	"통솔력" : 68,	"순발력" : 87,	"행운" : 51,	"무기종류" : "궁",	"갑옷종류" : "전포",	"특성30" : "물리 공격 강화%",	"특성30상세" : "12",	"특성50" : "지원 공격",	"특성50상세" : "",	"특성70" : "일격 필살",	"특성70상세" : "",	"특성90" : "장거리 궁술",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "연주 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "21",	},
        {	"이름" : "아린",	"병종" : "현자",	"코스트" : 9,	"계보" : "난세여걸의 패",	"무력" : 28,	"지력" : 91,	"통솔력" : 76,	"순발력" : 71,	"행운" : 92,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "MP 회복",	"특성30상세" : "35",	"특성50" : "연속 공격 면역",	"특성50상세" : "",	"특성70" : "연속 책략",	"특성70상세" : "",	"특성90" : "풍계 책략 전문화%",	"특성90상세" : "20",	"태수효과" : "공방",	"군주효과" : "기주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "19",	},
        {	"이름" : "가충",	"병종" : "도사",	"코스트" : 9,	"계보" : "마왕재림의 패",	"무력" : 46,	"지력" : 89,	"통솔력" : 73,	"순발력" : 43,	"행운" : 71,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "방해계 책략 강화%",	"특성30상세" : "15",	"특성50" : "연속 공격 면역",	"특성50상세" : "",	"특성70" : "회심 공격 면역",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "익주(북) 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "20",	},
        {	"이름" : "사마륜",	"병종" : "전차",	"코스트" : 7,	"계보" : "마왕재림의 패",	"무력" : 61,	"지력" : 63,	"통솔력" : 60,	"순발력" : 80,	"행운" : 84,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "방어력 보조%",	"특성30상세" : "10",	"특성50" : "돌진 공격%",	"특성50상세" : "3",	"특성70" : "혼란 공격%",	"특성70상세" : "30",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "163",	},
        {	"이름" : "사마충",	"병종" : "천자",	"코스트" : 8,	"계보" : "마왕재림의 패",	"무력" : 48,	"지력" : 21,	"통솔력" : 55,	"순발력" : 68,	"행운" : 89,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "물리 피해 감소%",	"특성30상세" : "10",	"특성50" : "사기 보조%",	"특성50상세" : "30",	"특성70" : "본대 패기",	"특성70상세" : "",	"특성90" : "주위 견고",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "출진 군량",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "23",	},
        {	"이름" : "백영",	"병종" : "도독",	"코스트" : 10,	"계보" : "마왕재림의 패",	"무력" : 67,	"지력" : 87,	"통솔력" : 79,	"순발력" : 82,	"행운" : 61,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "책략 명중률 증가",	"특성30상세" : "15",	"특성50" : "일책 필살",	"특성50상세" : "",	"특성70" : "공격 능력 전환",	"특성70상세" : "",	"특성90" : "책략 모방",	"특성90상세" : "",	"태수효과" : "은전",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "113",	},
        {	"이름" : "가남풍",	"병종" : "마왕",	"코스트" : 11,	"계보" : "마왕재림의 패",	"무력" : 65,	"지력" : 86,	"통솔력" : 59,	"순발력" : 68,	"행운" : 72,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "흡수 책략%",	"특성30상세" : "10",	"특성50" : "본대 각성",	"특성50상세" : "",	"특성70" : "사신 보옥 착용",	"특성70상세" : "",	"특성90" : "풍계 책략 특화%",	"특성90상세" : "20",	"태수효과" : "군량",	"군주효과" : "전 징세",	"별칭" : "마남풍",	"추천병종" : "책략훈련부",	"추천병종순" : "11",	},
        {	"이름" : "왕분",	"병종" : "창병",	"코스트" : 10,	"계보" : "천하일통의 패",	"무력" : 89,	"지력" : 80,	"통솔력" : 86,	"순발력" : 81,	"행운" : 81,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "공격 방어율 관통",	"특성30상세" : "10",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "공격 범위 변경",	"특성70상세" : "몰우전",	"특성90" : "피해 범위 변경",	"특성90상세" : "3격",	"태수효과" : "은전 징세",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "28",	},
        {	"이름" : "몽염",	"병종" : "경기병",	"코스트" : 9,	"계보" : "천하일통의 패",	"무력" : 83,	"지력" : 73,	"통솔력" : 84,	"순발력" : 82,	"행운" : 71,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "연속 책략 면역",	"특성30상세" : "",	"특성50" : "정신력 하강 공격",	"특성50상세" : "",	"특성70" : "돌격 이동",	"특성70상세" : "",	"특성90" : "회심 공격",	"특성90상세" : "",	"태수효과" : "시장",	"군주효과" : "정찰",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "44",	},
        {	"이름" : "몽무",	"병종" : "중기병",	"코스트" : 12,	"계보" : "천하일통의 패",	"무력" : 96,	"지력" : 70,	"통솔력" : 92,	"순발력" : 84,	"행운" : 83,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "본대 기합",	"특성30상세" : "",	"특성50" : "방어력 하강 공격",	"특성50상세" : "",	"특성70" : "피해 범위 변경",	"특성70상세" : "2격",	"특성90" : "일기당천",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "옹주(서) 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "3",	},
        {	"이름" : "이신",	"병종" : "보병",	"코스트" : 10,	"계보" : "천하일통의 패",	"무력" : 90,	"지력" : 69,	"통솔력" : 80,	"순발력" : 80,	"행운" : 78,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "분노 축적%",	"특성30상세" : "20",	"특성50" : "일격 필살",	"특성50상세" : "",	"특성70" : "역전용사",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "형주(북) 징세",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "13",	},
        {	"이름" : "왕의",	"병종" : "효기병",	"코스트" : 12,	"계보" : "천하일통의 패",	"무력" : 95,	"지력" : 85,	"통솔력" : 90,	"순발력" : 85,	"행운" : 82,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "일격 필살",	"특성30상세" : "",	"특성50" : "연속 책략 면역",	"특성50상세" : "",	"특성70" : "피해 범위 변경",	"특성70상세" : "2격",	"특성90" : "신출귀몰",	"특성90상세" : "",	"태수효과" : "군량 보관",	"군주효과" : "익주(남) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "11",	},
        {	"이름" : "서복",	"병종" : "산악기병",	"코스트" : 9,	"계보" : "천하일통의 패",	"무력" : 81,	"지력" : 74,	"통솔력" : 79,	"순발력" : 80,	"행운" : 68,	"무기종류" : "창",	"갑옷종류" : "전포",	"특성30" : "정신력 하강 공격",	"특성30상세" : "",	"특성50" : "돌격 이동",	"특성50상세" : "",	"특성70" : "본대 각성",	"특성70상세" : "",	"특성90" : "돌파 공격",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "옹주(동) 약탈",	"별칭" : "",	"추천병종" : "전투훈련부",	"추천병종순" : "48",	},
        {	"이름" : "창평군",	"병종" : "현자",	"코스트" : 11,	"계보" : "천하일통의 패",	"무력" : 80,	"지력" : 97,	"통솔력" : 88,	"순발력" : 78,	"행운" : 80,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "수계 책략 전문화%",	"특성30상세" : "20",	"특성50" : "회심 공격 면역",	"특성50상세" : "",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "군량 징세",	"군주효과" : "군량 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "5",	},
        {	"이름" : "왕전",	"병종" : "도독",	"코스트" : 13,	"계보" : "천하일통의 패",	"무력" : 85,	"지력" : 96,	"통솔력" : 95,	"순발력" : 85,	"행운" : 85,	"무기종류" : "보도",	"갑옷종류" : "전포",	"특성30" : "주동 공격",	"특성30상세" : "",	"특성50" : "연속 책략",	"특성50상세" : "",	"특성70" : "책략 모방",	"특성70상세" : "",	"특성90" : "일치단결",	"특성90상세" : "",	"태수효과" : "경작",	"군주효과" : "병주 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "71",	},
        {	"이름" : "여강",	"병종" : "검사",	"코스트" : 9,	"계보" : "천하일통의 패",	"무력" : 82,	"지력" : 72,	"통솔력" : 78,	"순발력" : 77,	"행운" : 77,	"무기종류" : "검",	"갑옷종류" : "전포",	"특성30" : "험로 이동",	"특성30상세" : "",	"특성50" : "돌진 공격%",	"특성50상세" : "4",	"특성70" : "돌격 이동",	"특성70상세" : "",	"특성90" : "연속 반격",	"특성90상세" : "",	"태수효과" : "항만",	"군주효과" : "옹주(동) 징세",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "13",	},
        {	"이름" : "조희",	"병종" : "군악대",	"코스트" : 6,	"계보" : "천하일통의 패",	"무력" : 45,	"지력" : 71,	"통솔력" : 63,	"순발력" : 70,	"행운" : 76,	"무기종류" : "선",	"갑옷종류" : "전포",	"특성30" : "보급계 책략 강화%",	"특성30상세" : "15",	"특성50" : "회심 공격 면역",	"특성50상세" : "",	"특성70" : "주위 각성",	"특성70상세" : "",	"특성90" : "주위 견고",	"특성90상세" : "",	"태수효과" : "제재소",	"군주효과" : "옹주(서) 약탈",	"별칭" : "",	"추천병종" : "사격훈련부",	"추천병종순" : "30",	},
        {	"이름" : "이사",	"병종" : "풍수사",	"코스트" : 9,	"계보" : "천하일통의 패",	"무력" : 48,	"지력" : 94,	"통솔력" : 70,	"순발력" : 67,	"행운" : 75,	"무기종류" : "보도",	"갑옷종류" : "도포",	"특성30" : "회심 공격 면역",	"특성30상세" : "",	"특성50" : "책략 모방",	"특성50상세" : "",	"특성70" : "주위 기합",	"특성70상세" : "",	"특성90" : "주위 강행",	"특성90상세" : "",	"태수효과" : "과수",	"군주효과" : "명품 상점",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "16",	},
        {	"이름" : "여불위",	"병종" : "책사",	"코스트" : 11,	"계보" : "천하일통의 패",	"무력" : 43,	"지력" : 91,	"통솔력" : 75,	"순발력" : 75,	"행운" : 95,	"무기종류" : "선",	"갑옷종류" : "도포",	"특성30" : "연속 공격 면역",	"특성30상세" : "",	"특성50" : "수완가",	"특성50상세" : "",	"특성70" : "주위 견고",	"특성70상세" : "",	"특성90" : "사신 소환",	"특성90상세" : "",	"태수효과" : "은전 징세",	"군주효과" : "은전 징세",	"별칭" : "",	"추천병종" : "책략훈련부",	"추천병종순" : "7",	},
        {	"이름" : "백기",	"병종" : "전차",	"코스트" : 13,	"계보" : "천하일통의 패",	"무력" : 88,	"지력" : 82,	"통솔력" : 99,	"순발력" : 89,	"행운" : 83,	"무기종류" : "창",	"갑옷종류" : "갑옷",	"특성30" : "돌파 공격",	"특성30상세" : "",	"특성50" : "파진 공격",	"특성50상세" : "",	"특성70" : "변칙 전술",	"특성70상세" : "",	"특성90" : "신출귀몰",	"특성90상세" : "",	"태수효과" : "은전 보관",	"군주효과" : "은전 약탈",	"별칭" : "",	"추천병종" : "방어훈련부",	"추천병종순" : "57",	},
        {	"이름" : "영정",	"병종" : "천자",	"코스트" : 15,	"계보" : "천하일통의 패",	"무력" : 76,	"지력" : 87,	"통솔력" : 85,	"순발력" : 88,	"행운" : 100,	"무기종류" : "검",	"갑옷종류" : "갑옷",	"특성30" : "구사일생",	"특성30상세" : "",	"특성50" : "분서갱유",	"특성50상세" : "",	"특성70" : "금성천리",	"특성70상세" : "",	"특성90" : "시황제",	"특성90상세" : "",	"태수효과" : "징세의 달인",	"군주효과" : "전 징세",	"별칭" : "",	"추천병종" : "군기훈련부",	"추천병종순" : "1",	},

    ]
}

function configMemberTypeList() {

    return [
        {	"병종" : "검사",	"공격력" : "A",	"정신력" : "C",	"방어력" : "A",	"순발력" : "S",	"사기" : "A",	"HP" : "793",	"MP" : "0",	"효과1" : "공격 명중률 증가",	"효과상세1" : "7%",	"효과2" : "공격력 보조",	"효과상세2" : "9%",	"효과3" : "책략 명중률 증가",	"효과상세3" : "10%",	"이동" : "6",	"무기" : "검",	"방어" : "전포",	"특성1" : "HP 보조 9%",	"특성10" : "순발력 보조 8%",	"특성15" : "물리 공격 강화 9%",	"특성20" : "금격 공격 15%",	"특성25" : "공격 책략 강화 9%",	},
        {	"병종" : "경기병",	"공격력" : "S",	"정신력" : "C",	"방어력" : "A",	"순발력" : "A",	"사기" : "A",	"HP" : "595",	"MP" : "114",	"효과1" : "공격력 보조",	"효과상세1" : "12%",	"효과2" : "지원 공격",	"효과상세2" : "",	"효과3" : "공격 방어율 관통",	"효과상세3" : "15%",	"이동" : "7",	"무기" : "창",	"방어" : "전포",	"특성1" : "공격 방어율 증가 9%",	"특성10" : "책략 방어율 증가 9%",	"특성15" : "연속 공격 강화 10%",	"특성20" : "순발력 보조 8%",	"특성25" : "흡혈 공격 6%",	},
        {	"병종" : "군악대",	"공격력" : "C",	"정신력" : "A",	"방어력" : "B",	"순발력" : "S",	"사기" : "A",	"HP" : "585",	"MP" : "228",	"효과1" : "주위 MP 회복",	"효과상세1" : "20",	"효과2" : "가무",	"효과상세2" : "",	"효과3" : "포용",	"효과상세3" : "",	"이동" : "6",	"무기" : "선",	"방어" : "전포",	"특성1" : "MP 보조 10%",	"특성10" : "MP 회복 5%",	"특성15" : "물리 피해 감소 8%",	"특성20" : "책략 피해 감소 8%",	"특성25" : "보급계 책략 강화 7%",	},
        {	"병종" : "군주",	"공격력" : "A",	"정신력" : "A",	"방어력" : "A",	"순발력" : "A",	"사기" : "S",	"HP" : "637",	"MP" : "129",	"효과1" : "공격 방어율 증가",	"효과상세1" : "10%",	"효과2" : "HP 보조",	"효과상세2" : "7%",	"효과3" : "책략 피해 감소",	"효과상세3" : "20%",	"이동" : "7",	"무기" : "검",	"방어" : "갑옷",	"특성1" : "책략 피해 감소 7%",	"특성10" : "물리 피해 감소 7%",	"특성15" : "물리 공격 강화 9%",	"특성20" : "공격 책략 강화 3%",	"특성25" : "주위 HP 회복 3%",	},
        {	"병종" : "궁기병",	"공격력" : "S",	"정신력" : "B",	"방어력" : "A",	"순발력" : "A",	"사기" : "A",	"HP" : "595",	"MP" : "109",	"효과1" : "물리 공격 강화",	"효과상세1" : "9%",	"효과2" : "순발력 보조",	"효과상세2" : "7%",	"효과3" : "공격 명중률 증가",	"효과상세3" : "6%",	"이동" : "7",	"무기" : "궁",	"방어" : "갑옷",	"특성1" : "공격 명중률 증가 9%",	"특성10" : "연속 공격 강화 9%",	"특성15" : "기마 공격 강화 10%",	"특성20" : "물리 공격 강화 10%",	"특성25" : "공격력 보조 10%",	},
        {	"병종" : "궁병",	"공격력" : "A",	"정신력" : "B",	"방어력" : "B",	"순발력" : "S",	"사기" : "A",	"HP" : "585",	"MP" : "109",	"효과1" : "순발력 보조",	"효과상세1" : "9%",	"효과2" : "공격 명중률 증가",	"효과상세2" : "15%",	"효과3" : "연속 공격 강화",	"효과상세3" : "50%",	"이동" : "6",	"무기" : "궁",	"방어" : "전포",	"특성1" : "방어력 보조 7%",	"특성10" : "순발력 보조 7%",	"특성15" : "기마 공격 강화 10%",	"특성20" : "공격 명중률 증가 10%",	"특성25" : "금책 공격 15%",	},
        {	"병종" : "노병",	"공격력" : "A",	"정신력" : "B",	"방어력" : "B",	"순발력" : "A",	"사기" : "S",	"HP" : "481",	"MP" : "104",	"효과1" : "공격력 보조",	"효과상세1" : "9%",	"효과2" : "물리 공격 강화",	"효과상세2" : "7%",	"효과3" : "공격 방어율 관통",	"효과상세3" : "10%",	"이동" : "5",	"무기" : "노",	"방어" : "전포",	"특성1" : "사기 보조 7%",	"특성10" : "순발력 보조 7%",	"특성15" : "연속 공격 강화 10%",	"특성20" : "공격 명중률 증가 10%",	"특성25" : "금구 공격 15%",	},
        {	"병종" : "노전차",	"공격력" : "B",	"정신력" : "B",	"방어력" : "A",	"순발력" : "A",	"사기" : "S",	"HP" : "595",	"MP" : "109",	"효과1" : "돌진 공격",	"효과상세1" : "6%",	"효과2" : "기습 공격",	"효과상세2" : "3%",	"효과3" : "사기 하강 공격",	"효과상세3" : "",	"이동" : "7",	"무기" : "노",	"방어" : "갑옷",	"특성1" : "기마 공격 강화 10%",	"특성10" : "연속 공격 강화 10%",	"특성15" : "물리 피해 감소 8%",	"특성20" : "방어력 보조 10%",	"특성25" : "공격 명중률 증가 7%",	},
        {	"병종" : "도독",	"공격력" : "A",	"정신력" : "A",	"방어력" : "A",	"순발력" : "A",	"사기" : "A",	"HP" : "585",	"MP" : "327",	"효과1" : "수계 책략 강화",	"효과상세1" : "9%",	"효과2" : "정신력 보조",	"효과상세2" : "7%",	"효과3" : "물리 공격 강화",	"효과상세3" : "20%",	"이동" : "6",	"무기" : "보도",	"방어" : "전포",	"특성1" : "HP 보조 9%",	"특성10" : "MP 보조 9%",	"특성15" : "공격력 보조 8%",	"특성20" : "정신력 보조 8%",	"특성25" : "주위 HP 회복 3%",	},
        {	"병종" : "도사",	"공격력" : "C",	"정신력" : "S",	"방어력" : "B",	"순발력" : "A",	"사기" : "S",	"HP" : "509",	"MP" : "238",	"효과1" : "방해계 책략 전문화",	"효과상세1" : "9%",	"효과2" : "사기 보조",	"효과상세2" : "20%",	"효과3" : "상태이상 반사 무시",	"효과상세3" : "50%",	"이동" : "5",	"무기" : "보도",	"방어" : "도포",	"특성1" : "책략 명중률 증가 9%",	"특성10" : "순발력 보조 7%",	"특성15" : "정신력 보조 8%",	"특성20" : "방해계 책략 강화 7%",	"특성25" : "MP 절약 12%",	},
        {	"병종" : "마왕",	"공격력" : "S",	"정신력" : "S",	"방어력" : "S",	"순발력" : "S",	"사기" : "S",	"HP" : "633",	"MP" : "357",	"효과1" : "정신력 보조",	"효과상세1" : "5%",	"효과2" : "상태 이상 공격",	"효과상세2" : "15%",	"효과3" : "HP 보조",	"효과상세3" : "10%",	"이동" : "5",	"무기" : "선",	"방어" : "도포",	"특성1" : "책략 명중률 증가 9%",	"특성10" : "방어력 보조 7%",	"특성15" : "정신력 보조 8%",	"특성20" : "풍계 책략 강화 7%",	"특성25" : "주위 MP 회복 3%",	},
        {	"병종" : "무인",	"공격력" : "S",	"정신력" : "B",	"방어력" : "A",	"순발력" : "S",	"사기" : "B",	"HP" : "684",	"MP" : "119",	"효과1" : "순발력 보조",	"효과상세1" : "9%",	"효과2" : "전 방어율 증가",	"효과상세2" : "12%",	"효과3" : "공격력 보조",	"효과상세3" : "5%",	"이동" : "6",	"무기" : "곤",	"방어" : "전포",	"특성1" : "공격 방어율 증가 9%",	"특성10" : "책략 방어율 증가 9%",	"특성15" : "공격력 보조 8%",	"특성20" : "순발력 보조 8%",	"특성25" : "HP 회복 5%",	},
        {	"병종" : "무희",	"공격력" : "A",	"정신력" : "A",	"방어력" : "B",	"순발력" : "S",	"사기" : "S",	"HP" : "585",	"MP" : "327",	"효과1" : "주위 각성",	"효과상세1" : "",	"효과2" : "유혹 책략 명중률 증가",	"효과상세2" : "50%",	"효과3" : "유혹 책략 강화",	"효과상세3" : "60%",	"이동" : "6",	"무기" : "곤",	"방어" : "전포",	"특성1" : "순발력 보조 7%",	"특성10" : "유혹 책략 명중률 증가 15%",	"특성15" : "공격력 보조 8%",	"특성20" : "유혹 책략 강화 10%",	"특성25" : "혼란 공격 15%",	},
        {	"병종" : "보병",	"공격력" : "B",	"정신력" : "B",	"방어력" : "S",	"순발력" : "B",	"사기" : "A",	"HP" : "798",	"MP" : "109",	"효과1" : "방어력 보조",	"효과상세1" : "9%",	"효과2" : "HP 보조",	"효과상세2" : "15%",	"효과3" : "간접 피해 감소",	"효과상세3" : "40%",	"이동" : "5",	"무기" : "검",	"방어" : "갑옷",	"특성1" : "HP 보조 9%",	"특성10" : "간접 피해 감소 7%",	"특성15" : "물리 피해 반사 7%",	"특성20" : "책략 피해 반사 7%",	"특성25" : "부동 공격 15%",	},
        {	"병종" : "산악기병",	"공격력" : "S",	"정신력" : "C",	"방어력" : "B",	"순발력" : "S",	"사기" : "B",	"HP" : "585",	"MP" : "119",	"효과1" : "순발력 보조",	"효과상세1" : "9%",	"효과2" : "전 방어율 증가",	"효과상세2" : "7%",	"효과3" : "공격력 보조",	"효과상세3" : "8%",	"이동" : "7",	"무기" : "창",	"방어" : "전포",	"특성1" : "사기 보조 7%",	"특성10" : "HP 보조 9%",	"특성15" : "공격력 보조 8%",	"특성20" : "연속 공격 강화 10%",	"특성25" : "금격 공격 15%",	},
        {	"병종" : "수군",	"공격력" : "S",	"정신력" : "B",	"방어력" : "A",	"순발력" : "S",	"사기" : "A",	"HP" : "684",	"MP" : "119",	"효과1" : "순발력 보조",	"효과상세1" : "9%",	"효과2" : "수전 보조",	"효과상세2" : "",	"효과3" : "연속 공격 강화",	"효과상세3" : "50%",	"이동" : "6",	"무기" : "검",	"방어" : "전포",	"특성1" : "연속 공격 강화 9%",	"특성10" : "수계 책략 강화 5%",	"특성15" : "물리 피해 반사 7%",	"특성20" : "책략 피해 반사 7%",	"특성25" : "방어력 보조 10%",	},
        {	"병종" : "웅술사",	"공격력" : "A",	"정신력" : "C",	"방어력" : "S",	"순발력" : "C",	"사기" : "S",	"HP" : "902",	"MP" : "104",	"효과1" : "HP 보조",	"효과상세1" : "10%",	"효과2" : "출혈 공격",	"효과상세2" : "30%",	"효과3" : "공격 명중률 증가",	"효과상세3" : "12%",	"이동" : "5",	"무기" : "곤",	"방어" : "전포",	"특성1" : "방어력 보조 7%",	"특성10" : "HP 보조 9%",	"특성15" : "물리 공격 강화 9%",	"특성20" : "HP 회복 4%",	"특성25" : "부동 공격 15%",	},
        {	"병종" : "적병",	"공격력" : "A",	"정신력" : "C",	"방어력" : "S",	"순발력" : "B",	"사기" : "S",	"HP" : "830",	"MP" : "119",	"효과1" : "사기 보조",	"효과상세1" : "9%",	"효과2" : "방어력 보조",	"효과상세2" : "9%",	"효과3" : "HP 보조",	"효과상세3" : "6%",	"이동" : "6",	"무기" : "검",	"방어" : "전포",	"특성1" : "HP 보조 9%",	"특성10" : "전 방어율 증가 4%",	"특성15" : "공격력 보조 8%",	"특성20" : "지계 책략 강화 7%",	"특성25" : "능력 이상 공격 15%",	},
        {	"병종" : "전차",	"공격력" : "A",	"정신력" : "B",	"방어력" : "A",	"순발력" : "B",	"사기" : "B",	"HP" : "704",	"MP" : "104",	"효과1" : "공격력 보조",	"효과상세1" : "9%",	"효과2" : "공격 명중률 증가",	"효과상세2" : "7%",	"효과3" : "바퀴 강화",	"효과상세3" : "4%",	"이동" : "7",	"무기" : "창",	"방어" : "갑옷",	"특성1" : "순발력 보조 7%",	"특성10" : "사기 보조 7%",	"특성15" : "공격 방어율 증가 10%",	"특성20" : "물리 피해 감소 8%",	"특성25" : "돌진 공격 2%",	},
        {	"병종" : "중기병",	"공격력" : "A",	"정신력" : "C",	"방어력" : "S",	"순발력" : "B",	"사기" : "S",	"HP" : "704",	"MP" : "109",	"효과1" : "돌진 방어술",	"효과상세1" : "5%",	"효과2" : "공격 명중률 증가",	"효과상세2" : "9%",	"효과3" : "돌진 공격",	"효과상세3" : "8%",	"이동" : "7",	"무기" : "창",	"방어" : "갑옷",	"특성1" : "순발력 보조 7%",	"특성10" : "사기 보조 7%",	"특성15" : "공격 방어율 증가 10%",	"특성20" : "간접 피해 감소 8%",	"특성25" : "물리 피해 반사 10%",	},
        {	"병종" : "창병",	"공격력" : "S",	"정신력" : "B",	"방어력" : "S",	"순발력" : "B",	"사기" : "B",	"HP" : "704",	"MP" : "109",	"효과1" : "공격력 보조",	"효과상세1" : "12%",	"효과2" : "기마 공격 강화",	"효과상세2" : "50%",	"효과3" : "지원 공격",	"효과상세3" : "",	"이동" : "5",	"무기" : "창",	"방어" : "갑옷",	"특성1" : "HP 보조 9%",	"특성10" : "방어력 보조 7%",	"특성15" : "물리 공격 강화 9%",	"특성20" : "전 방어율 증가 5%",	"특성25" : "기마 공격 강화 12%",	},
        {	"병종" : "책사",	"공격력" : "C",	"정신력" : "S",	"방어력" : "B",	"순발력" : "B",	"사기" : "S",	"HP" : "486",	"MP" : "286",	"효과1" : "화계 책략 강화",	"효과상세1" : "10%",	"효과2" : "정신력 보조",	"효과상세2" : "5%",	"효과3" : "MP 보조",	"효과상세3" : "20%",	"이동" : "5",	"무기" : "선",	"방어" : "도포",	"특성1" : "책략 명중률 증가 9%",	"특성10" : "MP 보조 9%",	"특성15" : "MP 절약 10%",	"특성20" : "화계 책략 강화 8%",	"특성25" : "정신력 보조 10%",	},
        {	"병종" : "천자",	"공격력" : "D",	"정신력" : "C",	"방어력" : "C",	"순발력" : "A",	"사기" : "S",	"HP" : "793",	"MP" : "129",	"효과1" : "사기충전",	"효과상세1" : "",	"효과2" : "위풍",	"효과상세2" : "",	"효과3" : "권위",	"효과상세3" : "",	"이동" : "7",	"무기" : "검",	"방어" : "갑옷",	"특성1" : "HP 보조 9%",	"특성10" : "공격 방어율 증가 10%",	"특성15" : "책략 방어율 증가 10%",	"특성20" : "HP 회복 5%",	"특성25" : "사기 보조 10%",	},
        {	"병종" : "포차",	"공격력" : "S",	"정신력" : "C",	"방어력" : "C",	"순발력" : "B",	"사기" : "S",	"HP" : "476",	"MP" : "114",	"효과1" : "공격 명중률 증가",	"효과상세1" : "10%",	"효과2" : "사기 보조",	"효과상세2" : "6%",	"효과3" : "물리 공격 강화",	"효과상세3" : "3%",	"이동" : "4",	"무기" : "포",	"방어" : "도포",	"특성1" : "책략 피해 감소 7%",	"특성10" : "물리 피해 감소 7%",	"특성15" : "공격 명중률 증가 10%",	"특성20" : "공격력 보조 8%",	"특성25" : "중독 공격 15%",	},
        {	"병종" : "풍수사",	"공격력" : "C",	"정신력" : "S",	"방어력" : "B",	"순발력" : "B",	"사기" : "B",	"HP" : "476",	"MP" : "375",	"효과1" : "보급계 책략 강화",	"효과상세1" : "8%",	"효과2" : "MP 보조",	"효과상세2" : "8%",	"효과3" : "간접 피해 감소",	"효과상세3" : "7%",	"이동" : "6",	"무기" : "보도",	"방어" : "도포",	"특성1" : "책략 피해 감소 7%",	"특성10" : "물리 피해 감소 7%",	"특성15" : "MP 보조 10%",	"특성20" : "보급계 책략 강화 7%",	"특성25" : "MP 회복 5%",	},
        {	"병종" : "현자",	"공격력" : "B",	"정신력" : "S",	"방어력" : "A",	"순발력" : "B",	"사기" : "S",	"HP" : "509",	"MP" : "357",	"효과1" : "원소 책략 강화",	"효과상세1" : "9%",	"효과2" : "정신력 보조",	"효과상세2" : "5%",	"효과3" : "HP 보조",	"효과상세3" : "7%",	"이동" : "5",	"무기" : "선",	"방어" : "도포",	"특성1" : "책략 명중률 증가 9%",	"특성10" : "방어력 보조 7%",	"특성15" : "정신력 보조 8%",	"특성20" : "풍계 책략 강화 7%",	"특성25" : "주위 MP 회복 3%",	},
        {	"병종" : "호술사",	"공격력" : "S",	"정신력" : "C",	"방어력" : "B",	"순발력" : "S",	"사기" : "C",	"HP" : "679",	"MP" : "104",	"효과1" : "피해 범위 확장",	"효과상세1" : "2격",	"효과2" : "순발력 보조",	"효과상세2" : "12%",	"효과3" : "주위 둔병",	"효과상세3" : "",	"이동" : "6",	"무기" : "곤",	"방어" : "전포",	"특성1" : "공격 명중률 증가 9%",	"특성10" : "공격 방어율 증가 9%",	"특성15" : "공격력 보조 8%",	"특성20" : "물리 피해 감소 8%",	"특성25" : "상태 이상 공격 15%",	},
        {	"병종" : "효기병",	"공격력" : "S",	"정신력" : "C",	"방어력" : "C",	"순발력" : "S",	"사기" : "A",	"HP" : "704",	"MP" : "0",	"효과1" : "공격 명중률 증가",	"효과상세1" : "15%",	"효과2" : "일당백",	"효과상세2" : "5%",	"효과3" : "학살",	"효과상세3" : "10%",	"이동" : "7",	"무기" : "창",	"방어" : "갑옷",	"특성1" : "순발력 보조 8%",	"특성10" : "공격 방어율 증가 9%",	"특성15" : "책략 방어율 증가 9%",	"특성20" : "간접 피해 감소 8%",	"특성25" : "HP 보조 9%",	},

        
    ]

}

function configBopaeList() {

    return [
        {name : "물리피해감소",	category : "청룡",	level : 4,	bp1 : "항",	bp2 : "저",	bp3 : "방",	bp4 : "심",	desc : "방어 시 35%의 확률로 물리 공격으로 입는 피해가 30% 만큼 감소한다."},
        {name : "MP파괴공격",	category : "청룡",	level : 4,	bp1 : "각",	bp2 : "저",	bp3 : "방",	bp4 : "기",	desc : "물리 공격에 성공하면 피해량의 50% 만큼 상대의 MP를 추가로 감소시킨 후 피해를 입힌다."},
        {name : "재충전",	category : "청룡",	level : 4,	bp1 : "각",	bp2 : "항",	bp3 : "미",	bp4 : "기",	desc : "감전 상태의 적 부대에게 물리 피격 시 피해를 입은 후 피해량의 75% 만큼 HP를 회복한다."},
        {name : "용의분노",	category : "청룡",	level : 4,	bp1 : "방",	bp2 : "심",	bp3 : "미",	bp4 : "기",	desc : "퇴각 시 본대의 주위 8칸(ZOC)에 존재하는 적 부대에게 감전 효과를 부여한다./n단, 간접 공격으로 퇴각 시 감전 효과를 부여하지 않는다."},
        {name : "감전공격",	category : "청룡",	level : 4,	bp1 : "각",	bp2 : "방",	bp3 : "심",	bp4 : "기",	desc : "물리 공격에 성공하면 35%의 확률로 피해자에게 감전 효과를 건다."},
        {name : "감전책략",	category : "청룡",	level : 4,	bp1 : "저",	bp2 : "방",	bp3 : "미",	bp4 : "기",	desc : "공격 책략 사용 시 50%의 확률로 책략의 단일 지정 대상만을 감전 상태로 만든다./n단일 지정 대상이 없는 전체 범위 책략에는 발동하지 않는다."},
        {name : "용조의무구",	category : "청룡",	level : 4,	bp1 : "각",	bp2 : "항",	bp3 : "방",	bp4 : "기",	desc : "물리 공격에 성공하면 50%의 확률로 거대한 벼락을 떨어뜨려 90의 추가 피해를 입힌다."},
        {name : "용아의무구",	category : "청룡",	level : 4,	bp1 : "각",	bp2 : "저",	bp3 : "방",	bp4 : "심",	desc : "물리 공격에 성공하면 30%의 확률로 주 피격자의 ZOC(대몰우전)에 위치한 적군에게 무작위로 벼락이 깃든 검을 최대 5개 떨어뜨린다./n각 벼락은 50의 추가 피해를 준다."},
        {name : "파동의무구",	category : "청룡",	level : 4,	bp1 : "각",	bp2 : "항",	bp3 : "심",	bp4 : "미",	desc : "물리 공격에 성공하면 공격자의 반대 방향으로 1칸 밀어낸다.\n밀어낼 수 없는 경우와 연속 공격의 첫 공격은 최대 HP의 5%만큼 추가 피해가 발생한다.\n단, 추가 피해는 공격자 공격력의 10%를 초과할 수 없다."},
        {name : "역린의무구",	category : "청룡",	level : 4,	bp1 : "저",	bp2 : "방",	bp3 : "심",	bp4 : "미",	desc : "물리 공격에 성공하면 주 피격자를 시작으로 ZOC(8방향) 확산 범위를 갖는 벼락이 최대 2명까지 확산된다.\n벼락은 주 피격자에게 가한 피해의 7% 추가 피해를 준다."},
        {name : "혼란면역",	category : "청룡",	level : 3,	bp1 : "항",	bp2 : "저",	bp3 : "심",	bp4 : "미",	desc : "상태이상 혼란을 100% 방어한다."},
        {name : "물리피해감소",	category : "청룡",	level : 3,	bp1 : "항",	bp2 : "저",	bp3 : "방",	bp4 : "심",	desc : "방어 시 35%의 확률로 물리 공격으로 입는 피해가 10% 만큼 감소한다."},
        {name : "재충전",	category : "청룡",	level : 3,	bp1 : "각",	bp2 : "항",	bp3 : "미",	bp4 : "기",	desc : "감전 상태의 적 부대에게 물리 피격 시 피해를 입은 후 피해량의 25% 만큼 HP를 회복한다."},
        {name : "감전면역",	category : "청룡",	level : 3,	bp1 : "각",	bp2 : "항",	bp3 : "저",	bp4 : "미",	desc : "상태이상 감전을 100% 방어한다."},
        {name : "책략피해감소",	category : "주작",	level : 4,	bp1 : "귀",	bp2 : "성",	bp3 : "익",	bp4 : "진",	desc : "방어 시 35%의 확률로 책략 피해를 30% 감소시킨다.\n단, 사신 책략 피해는 감소하지 않는다."},
        {name : "화염의분노",	category : "주작",	level : 4,	bp1 : "정",	bp2 : "유",	bp3 : "장",	bp4 : "진",	desc : "퇴각시 본대의 주위 8칸(ZOC)에 화염 지형을 생성하고, 범위 내 모든 적에게 부동 상태이상을 부여한다."},
        {name : "화염의보복",	category : "주작",	level : 4,	bp1 : "정",	bp2 : "유",	bp3 : "성",	bp4 : "익",	desc : "화염의 가호로 보패 효과에 의한 위치 이동 효과에 면역되고, 이동하지 않아서 생기는 추가 피해를 공격자에게 100% 전가한다."},
        {name : "재빠른대처",	category : "주작",	level : 4,	bp1 : "귀",	bp2 : "유",	bp3 : "장",	bp4 : "익",	desc : "지원 공격의 피해를 50% 감소시킨다.\n지원 공격으로 발생하는 재반격 또한 피해가 감소한다."},
        {name : "화염의장벽",	category : "주작",	level : 4,	bp1 : "정",	bp2 : "성",	bp3 : "장",	bp4 : "진",	desc : "책략 사용 시 15% 확률로 본대에 화염의 장벽 효과를 1 부여한다. 최대 2까지 중첩 가능하다.\n연속 책략에는 발동하지 않는다."},
        {name : "화염공격",	category : "주작",	level : 4,	bp1 : "정",	bp2 : "성",	bp3 : "장",	bp4 : "익",	desc : "물리 공격 성공 시 50% 확률로 공격 지정 대상에게만 70의 추가 피해를 입히고, 피격자에게 화염의 표식을 1 건다."},
        {name : "화절",	category : "주작",	level : 4,	bp1 : "정",	bp2 : "유",	bp3 : "장",	bp4 : "익",	desc : "물리 공격 성공 시 화염의 표식이 2 이상 부여된 적에게 발동한다. 적 부대가 가진 화염의 표식을 모두 제거하고 해당 부대에게만 화염의 표식 1당 피해량의 15%만큼 추가 피해를 준다.\n표식 1당 추가 피해량은 공격력의 10%를 초과할 수 없다."},
        {name : "확산계책",	category : "주작",	level : 4,	bp1 : "정",	bp2 : "유",	bp3 : "익",	bp4 : "진",	desc : "공격 책략 성공 시 상대를 1칸 밀어낸다.\n밀어낼 수 없는 경우와 연속 책략의 첫 책략은 책략 피해량의 10%에 해당하는 추가 피해가 발생한다.\n범위 책략 시에는 주 대상에게만 적용된다."},
        {name : "갈퀴계책",	category : "주작",	level : 4,	bp1 : "귀",	bp2 : "유",	bp3 : "장",	bp4 : "진",	desc : "공격 책략 성공 시 책략의 모든 피격자를 1칸 끌어들인다.\n끌어당길 수 없는 경우와 연속 책략의 첫 책략은 책략 피해량의 6%에 해당되는 추가 피해가 발생한다.\n단일 지정 대상이 없는 전체 범위 책략에는 발동하지 않는다."},
        {name : "화염뢰계책",	category : "주작",	level : 4,	bp1 : "귀",	bp2 : "유",	bp3 : "성",	bp4 : "진",	desc : "공격 책략 성공 시 100%의 확률로 화염의 꽃을 피워 책략 지정 대상에게 화염의 표식을 1 걸고, 대상 위치에 화염 지형을 생성한다."},
        {name : "화폭계책",	category : "주작",	level : 4,	bp1 : "정",	bp2 : "귀",	bp3 : "장",	bp4 : "진",	desc : "공격 책략 성공 시 50% 확률로 책략 지정 대상과 대상 주위 십자 범위에 화염 폭발을 일으켜 각각 50의 추가 피해를 주고 화염 지형을 생성한다."},
        {name : "화검계책",	category : "주작",	level : 4,	bp1 : "유",	bp2 : "장",	bp3 : "익",	bp4 : "진",	desc : "공격 책략 성공 시 주 피격자를 시작으로 몰우전 범위 내 최대 2명의 적 부대에게 확산되는 화염의 칼날 공격을 한다.\n화염의 칼날은 주 피격자에게 가한 피해의 3%에 해당하는 피해를 주고 화염의 표식을 1 부여한다."},
        {name : "금책면역",	category : "주작",	level : 3,	bp1 : "정",	bp2 : "유",	bp3 : "성",	bp4 : "장",	desc : "상태이상 금책을 100% 방어한다."},
        {name : "책략피해감소",	category : "주작",	level : 3,	bp1 : "귀",	bp2 : "성",	bp3 : "익",	bp4 : "진",	desc : "방어 시 35%의 확률로 책략 피해를 10% 감소시킨다.\n단, 사신 책략 피해는 감소하지 않는다."},
        {name : "재빠른대처",	category : "주작",	level : 3,	bp1 : "귀",	bp2 : "유",	bp3 : "장",	bp4 : "익",	desc : "지원 공격의 피해를 25% 감소시킨다.\n지원 공격으로 발생하는 재반격 또한 피해가 감소한다."},
        {name : "화염계책",	category : "주작",	level : 3,	bp1 : "정",	bp2 : "귀",	bp3 : "성",	bp4 : "진",	desc : "공격 책략 성공 시 100%의 확률로 책략 지정 대상의 위치에 화염 지형을 생성한다."},
        {name : "진화",	category : "주작",	level : 3,	bp1 : "정",	bp2 : "귀",	bp3 : "성",	bp4 : "익",	desc : "본대가 화염의 표식에 대한 각성 효과를 사용할 때 3씩 감소하게 한다.\n효과, 책략, 도구에 의한 모든 행동에 해당한다."},
        {name : "회심피해감소",	category : "백호",	level : 4,	bp1 : "위",	bp2 : "묘",	bp3 : "필",	bp4 : "삼",	desc : "회심 공격으로 입는 피해가 50% 만큼 감소한다."},
        {name : "백호의가호",	category : "백호",	level : 4,	bp1 : "규",	bp2 : "누",	bp3 : "필",	bp4 : "자",	desc : "아군 부대를 회복시킬 때마다 회복 책략의 단일 지정 대상에게 백호의 가호를 1 건다. 백호의 가호를 가진 부대가 피격 시 걸려있던 백호의 가호가 모두 사라지고, 1의 가호당 200의 HP가 회복된다. 최대 2까지 중첩 가능하다."},
        {name : "포용",	category : "백호",	level : 4,	bp1 : "누",	bp2 : "위",	bp3 : "묘",	bp4 : "삼",	desc : "속성이 HP 회복인 책략을 사용한 경우, 회복 대상에게 재생 상태를 부여한다. 재생 상태인 부대는 매 턴 최대 체력의 10% 만큼 HP를 회복한다."},
        {name : "호령",	category : "백호",	level : 4,	bp1 : "규",	bp2 : "위",	bp3 : "묘",	bp4 : "자",	desc : "물리 공격에 성공하면 대상의 최대 HP의 10% 만큼 추가 피해를 주고, 호령으로 입힌 전체 추가 피해만큼 본대의 HP를 회복한다. 단, 추가 피해는 공격자 공격력의 10%를 초과할 수 없다. '연속 공격, 조가창술'인 경우 첫 공격에만 발동하며, '지원 공격, 재반격' 시에는 효과가 발동하지 않는다."},
        {name : "재생의바람",	category : "백호",	level : 4,	bp1 : "누",	bp2 : "위",	bp3 : "필",	bp4 : "삼",	desc : "공격 책략 성공 시 주 피격자를 기준으로 몰우전 범위 내 본대를 제외한 최대 2명의 아군 부대의 HP를 주 피격자에게 가한 피해의 10% 만큼 회복시킨다."},
        {name : "각성의바람",	category : "백호",	level : 4,	bp1 : "누",	bp2 : "묘",	bp3 : "필",	bp4 : "삼",	desc : "아군 부대의 해로운 상태이상 효과 제거 시 단일 지정 대상 지역을 포함한 주위 십자 범위를 1턴간 상태이상 면역 지역으로 만든다. ※ 해당 위치에 있을 때 '상태이상 면역' 효과를 갖게 되는 것으로, 이전에 받은 상태이상이 곧바로 회복되지는 않는다."},
        {name : "최후의숨결",	category : "백호",	level : 4,	bp1 : "규",	bp2 : "누",	bp3 : "위",	bp4 : "자",	desc : "퇴각 시 모든 아군 부대의 상태이상 효과를 제거하고 최대 HP의 20% 만큼 회복시킨다."},
        {name : "최후의항전",	category : "백호",	level : 4,	bp1 : "규",	bp2 : "누",	bp3 : "묘",	bp4 : "자",	desc : "퇴각 시 모든 아군 부대의 상태이상 효과를 제거하고 아군 부대에게 공격력 증가, 방어력 증가 효과를 부여한다."},
        {name : "최후의계책",	category : "백호",	level : 4,	bp1 : "위",	bp2 : "필",	bp3 : "자",	bp4 : "삼",	desc : "퇴각 시 모든 아군 부대의 상태이상 효과를 제거하고 아군 부대엑 정신력 증가, 방어력 증가 효과를 부여한다."},
        {name : "금격면역",	category : "백호",	level : 3,	bp1 : "규",	bp2 : "묘",	bp3 : "필",	bp4 : "자",	desc : "상태이상 금격을 100% 방어한다."},
        {name : "회심피해감소",	category : "백호",	level : 3,	bp1 : "위",	bp2 : "묘",	bp3 : "필",	bp4 : "삼",	desc : "회심 공격으로 입는 피해가 20% 만큼 감소한다."},
        {name : "최후의각성",	category : "백호",	level : 3,	bp1 : "규",	bp2 : "누",	bp3 : "자",	bp4 : "삼",	desc : "퇴각 시 모든 아군 부대의 상태이상 효과를 제거한다."}


    ]
}

function configItemList() {

    return [
        {	"이름" : "경반갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 0,	"사기" : 20,	"이동력" : 0,	"특수효과" : "간접피해감소",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "거울처럼 빛나는 갑옷. 빛의 반사로 활이나 포 같은 간접 공격 피해를 감소하는 효과가 있다."	},
        {	"이름" : "금칠도철갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 12,	"사기" : 0,	"이동력" : 0,	"특수효과" : "부동면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "금으로 도색한 철갑."	},
        {	"이름" : "금흉갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 95,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "전방어율증가",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가슴에 대는 보호대로 금을 부착해서 제작."	},
        {	"이름" : "다문천갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 100,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략피해감소",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불교의 사천왕 중 북방을 맡은 다문천왕의 갑옷. 신비한 힘이 깃들어 있다."	},
        {	"이름" : "두석린갑옷",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 100,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "MP방어",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "두석, 즉 놋쇠로 만든 미늘을 연결하여 만든 갑옷."	},
        {	"이름" : "백호갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 7,	"방어력" : 115,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "운기조식",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "중앙에 백호 문양을 새겨넣은 갑옷"	},
        {	"이름" : "보인갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 95,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "회심공격면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "갑엽을 가죽끈과 갑정을 사용하여 엮은 전신을 덮는 매우 견고한 개갑."	},
        {	"이름" : "수면탄두연환개",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "물리피해감소",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "짐승이 머리를 삼키는 장식이 된 갑옷. 여포가 입었던 갑옷으로 물리 공격을 감소시키는 능력이 있다고 한다."	},
        {	"이름" : "정람갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 95,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "순발력보조",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정람의 기운이 깃들어진 갑옷."	},
        {	"이름" : "정홍갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 105,	"순발력" : 12,	"사기" : 5,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정홍의 기운이 깃들어진 갑옷."	},
        {	"이름" : "정황갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 110,	"순발력" : 12,	"사기" : 7,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "150",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정황의 기운이 깃들어진 갑옷."	},
        {	"이름" : "종장철판갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 80,	"순발력" : 12,	"사기" : 12,	"이동력" : 0,	"특수효과" : "상태이상반사",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "종장에 철판을 대어 제작한 갑옷"	},
        {	"이름" : "철미늘갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 12,	"사기" : 0,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철판을 엮어 만든 갑옷."	},
        {	"이름" : "철피갑주",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 12,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략방어율증가",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철판을 가죽끈으로 엮어 만든 갑주."	},
        {	"이름" : "청동쇄자갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 5,	"사기" : 12,	"이동력" : 0,	"특수효과" : "연속공격면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청동으로 제작한 연환갑."	},
        {	"이름" : "치우갑옷",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 20,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신화 속 인물인 치우가 사용하던 갑옷."	},
        {	"이름" : "칠단단갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 85,	"순발력" : 5,	"사기" : 12,	"이동력" : 0,	"특수효과" : "연속책략면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철판을 칠 단으로 덧대어 만든 갑옷"	},
        {	"이름" : "팔기갑",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 85,	"순발력" : 15,	"사기" : 0,	"이동력" : 0,	"특수효과" : "피해전가",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "기병이 사용하도록 만들어진 갑옷."	},
        {	"이름" : "흑광갑옷",	"등급" : "7",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 95,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "중독면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "흑광을 이용해 만든 개갑."	},
        {	"이름" : "구리가라검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "회심공격강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "부동명왕이 오른손에 들고 있는 검. 부동명왕의 화신인 구리가라 용왕의 이름에 걸맞게 검신을 용이 휘감고 불꽃에 싸여 있다."	},
        {	"이름" : "금교전",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 90,	"정신력" : 10,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전정가위의 모양을 띠고 있으나 분리해 쌍수도로 사용 가능한 전설 속의 무기. 한 쌍의 교룡을 잡아 그 내력을 주입해 만들었다고 한다."	},
        {	"이름" : "류피검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 115,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹독의 기운이 서려있는 검."	},
        {	"이름" : "마도",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 112,	"정신력" : 10,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "마물의 기운이 서려있는 검."	},
        {	"이름" : "명광검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 110,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "기습공격",	"특수효과수치" : "0.03",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "태양을 가를 수 있다는 명검"	},
        {	"이름" : "백련검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 96,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "군자의 상징인 백련이 장식되어 있는 검."	},
        {	"이름" : "북도",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 112,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "북도 장군이 사용하던 검."	},
        {	"이름" : "상장검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 98,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "파진공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "상장군이 사용하던 검."	},
        {	"이름" : "신위검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 120,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "일격필살",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "화려한 문양으로 칼집을 장식한 검. 주로 고위 관료들이 자신의 위엄을 내세우기 위해 차고 다녔다."	},
        {	"이름" : "안모도",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 5,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가는 도선의 형태가 아름다운 도."	},
        {	"이름" : "예도",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "무반격공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "날이 날카로우며 곡선 형태를 한 환도."	},
        {	"이름" : "운광검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 80,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "구름과 달을 가를 수 있다는 명검"	},
        {	"이름" : "월왕구천검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "월왕 구천이 직접 제작. 월왕구천자작용검이라는 상감이 인상적인 청동검. 칼날 표면에 마름모꼴의 문양이 새겨져 있으며, 칼자루에는 실선이 두려 있고 남색 유리와 녹색의 보석으로 정교하게 상감이 되어 있다."	},
        {	"이름" : "의천검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "주동공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조조 소유의 검. 청강검과 한 쌍을 이룬다. 폭이 넓고 아주 튼튼하다."	},
        {	"이름" : "자웅일대검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 85,	"정신력" : 10,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "재반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "유비 소유의 검. 도원결의 후에 제조하여 이후 줄곧 애용했다. 두 자루가 한 쌍이기 때문에 적의 반격에 대하여 반격할 수 있다. 쌍고검이라고도 불린다."	},
        {	"이름" : "참사검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 95,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "한고조 유방이 망탕산의 구렁이를 벤 전설로 유명한 명검. 옥새와 함께 계승되는 정통 제위의 상징."	},
        {	"이름" : "천유검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 97,	"정신력" : 0,	"방어력" : 0,	"순발력" : 15,	"사기" : 0,	"이동력" : 0,	"특수효과" : "인도공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "하늘의 기운이 서려있는 검."	},
        {	"이름" : "초천검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "선제공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "서초패왕 항우가 사용했다고 전해지는 명검. 초진창과 한 쌍을 이룬다."	},
        {	"이름" : "파산검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 90,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "흡혈공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "오구의 일종으로 바위를 가르고 산도 부수어 넘어뜨릴 수 있는 검."	},
        {	"이름" : "헌원검",	"등급" : "7",	"종류" : "무기",	"종류2" : "검",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "피해범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "중국 신화에 나오는 삼황오제 중 한 명인 황제가 사용했다는 검이다. 푸르고 투명한 광채를 가진 청동검."	},
        {	"이름" : "강철장극",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 97,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "금구공격",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "강철로 제작한 길은 극."	},
        {	"이름" : "금강대부",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 115,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "일격필살",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "매우 단단한 광석으로 만들어진 대부. 어떤 갑옷이라도 쪼갤 수 있다고 한다."	},
        {	"이름" : "금책금곤",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 97,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "금책공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "금으로 제작하여 도술을 봉인할 수 있는 곤."	},
        {	"이름" : "독룡추",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 100,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독룡 문양으로 장식된 곤."	},
        {	"이름" : "독살극",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 96,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹독의 기운이 서려있는 극"	},
        {	"이름" : "만혼봉",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 97,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "만혼이 빠져나갈 듯한 악령이 서려있는 봉."	},
        {	"이름" : "묵음추",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 97,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "소리 보다 빠르게 휘두를 수 있는 극."	},
        {	"이름" : "반고부",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "무반격공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "거인 반고의 도끼. 삼오력기에 따르면 반고는 이 도끼로 혼돈을 쪼개고 하늘과 땅을 나누었다고 한다."	},
        {	"이름" : "백금과",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 80,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "피해범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백금으로 제작한 과."	},
        {	"이름" : "백호곤",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 87,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "주동공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백호 문양으로 장식된 곤."	},
        {	"이름" : "비뢰추",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 105,	"정신력" : 0,	"방어력" : 10,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "기습공격",	"특수효과수치" : "0.03",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "끝에 수많은 징을 박아놓은 추."	},
        {	"이름" : "수리추",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 91,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "추를 수리 모양으로 제작한 유성추."	},
        {	"이름" : "신능극",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 92,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신의 재능으로 만든 강력한 극."	},
        {	"이름" : "쌍편",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 81,	"정신력" : 10,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "재반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철편을 양손에 쥐고 다루도록 만들어진 무기. 주로 쓰는 손에 맞춰 13근, 12근의 무게로 만들어졌다."	},
        {	"이름" : "여의봉",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 86,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "서유기에 등장하는 손오공의 무기. 본명은 여의금고봉. 마음대로 늘어나는 금고리가 달린 봉이란 의미로, 원래는 바다의 깊이를 재는 용도였다."	},
        {	"이름" : "역천신모",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "악비의 창으로 역천동의 뱀 요괴가 둔갑했다고 한다."	},
        {	"이름" : "음양곤",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "인도공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "양 끝에 음양의 기운이 서려있는 곤."	},
        {	"이름" : "주작곤",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 83,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "선제공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주작 문양으로 장식된 곤."	},
        {	"이름" : "청룡곤",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 81,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청룡 문양으로 장식된 곤."	},
        {	"이름" : "현무곤",	"등급" : "7",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 84,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "파진공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "현무 문양으로 장식된 곤."	},
        {	"이름" : "강화맥궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 110,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "피해범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "쇠붙이나 동물의 뿔로 만든 각궁을 강화한 활."	},
        {	"이름" : "결박궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 112,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "박달나무로 만든 아주 단단한 활."	},
        {	"이름" : "국화궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 104,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "국화 문양이 새겨져 있는 활."	},
        {	"이름" : "독룡궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 114,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "활대 끝을 독룡으로 장식한 활."	},
        {	"이름" : "독살비전",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 112,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹독의 기운이 서려있는 활."	},
        {	"이름" : "동호비궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "선제공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "유목민족이 사용하던 기마사격용의 가벼운 활. 오환, 선비족이 사용했다."	},
        {	"이름" : "만혼궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 108,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "만혼이 빠져나갈 듯한 악령이 서려있는 활."	},
        {	"이름" : "매화수전",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 112,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "수전에 매화 문양을 추가하여 아름다움을 강화한 활."	},
        {	"이름" : "묵음궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 112,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "금구공격",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "소리 보다 빠르게 화살을 발사할 수 있는 활."	},
        {	"이름" : "백호궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "주동공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백호 문양으로 장식된 활."	},
        {	"이름" : "벽력궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 115,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "일격필살",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "강력한 위력의 화살을 쏠 수 있는 궁. 화살이 우는 소리에 근방에 있는 사람들의 귀가 멀 정도라고 한다."	},
        {	"이름" : "신능궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 112,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신의 재능으로 만든 강력한 활."	},
        {	"이름" : "음양궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 109,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "인도공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "활대 양 끝에 음양의 기운이 서려있는 활."	},
        {	"이름" : "주작궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 115,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주작 문양으로 장식된 활."	},
        {	"이름" : "청룡궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 110,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청룡 문양으로 장식된 활."	},
        {	"이름" : "청황궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 102,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황충이 애용했던 강력한 활."	},
        {	"이름" : "파천궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 110,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "기습공격",	"특수효과수치" : "0.03",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "하늘을 부술 정도로 강력한 위력을 낼 수 있는 활."	},
        {	"이름" : "현무궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "무반격공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "현무 문양으로 장식된 활."	},
        {	"이름" : "활영궁",	"등급" : "7",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "재반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "감녕이 사용했다고 전해지는 활. 옥돌을 뚫는다고 한다."	},
        {	"이름" : "국화노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "국화 문양이 새겨져 있는 노."	},
        {	"이름" : "극의노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "재반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "연속으로 화살을 발사할 수 있도록 연사 속도를 극으로 끌어올린 노."	},
        {	"이름" : "능각노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 10,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "모서리를 뾰족하게 만들어 근접 방어력을 강화한 노."	},
        {	"이름" : "독룡노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 10,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독룡으로 장식한 노."	},
        {	"이름" : "독살노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹독의 기운이 서려있는 노."	},
        {	"이름" : "만혼노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 10,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "만혼이 빠져나갈 듯한 악령이 서려있는 노."	},
        {	"이름" : "맹강노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "피해범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "동시에 여러 발을 발사할 수 있도록 제작한 노."	},
        {	"이름" : "묵음노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "금구공격",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "소리 보다 빠르게 화살을 발사할 수 있는 노."	},
        {	"이름" : "백호노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "주동공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백호 문양으로 장식된 노."	},
        {	"이름" : "비연노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "선제공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "하늘의 연을 쏘아 맞출 수 있을 정도로 정확도를 높힌 노."	},
        {	"이름" : "수질노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 110,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "일격필살",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "장치에 고정시켜 사용하는 노. 이동성은 떨어지지만 뛰어난 위력을 자랑한다."	},
        {	"이름" : "신능노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "상태이상공격",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신의 재능으로 만든 강력한 노."	},
        {	"이름" : "영광금귀신기노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "무제한반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "한 발만 쏘아도 천 명의 화살이 맞는다고 하는 노. 왕국의 안위를 책임지고 있었으나 안양왕의 딸이 어떤 한인에게 반해 노의 줄을 끊는 바람에 나라는 멸망하고 남월이 세워졌다고 한다."	},
        {	"이름" : "오호",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황제가 치우를 정복한 이후 용을 타고 다시 하늘로 올라갈 때 떨어졌다는 황제의 활. 오호란 까마귀의 울음소리란 뜻이며, 후대에는 명궁의 대명사로 거론되었다."	},
        {	"이름" : "음양노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "인도공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "양 끝에 음양의 기운이 서려있는 노."	},
        {	"이름" : "주작노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주작 문양으로 장식된 노."	},
        {	"이름" : "질풍노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 90,	"정신력" : 0,	"방어력" : 10,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "기습공격",	"특수효과수치" : "0.03",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "노의 줄을 개량하여 빠르게 발사할 수 있는 노."	},
        {	"이름" : "청룡노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청룡 문양으로 장식된 노."	},
        {	"이름" : "현무노",	"등급" : "7",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "무반격공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "현무 문양으로 장식된 노."	},
        {	"이름" : "백련문의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "도포",	"공격력" : 0,	"정신력" : 15,	"방어력" : 75,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "운기조식",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "연꽃 자수를 수놓은 의복"	},
        {	"이름" : "자운금의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "도포",	"공격력" : 0,	"정신력" : 15,	"방어력" : 75,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략피해감소",	"특수효과수치" : "0.35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "구름 무늬가 수놓아져 있는 자줏빛의 비단옷."	},
        {	"이름" : "기린보도",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 90,	"방어력" : 7,	"순발력" : 0,	"사기" : 14,	"이동력" : 0,	"특수효과" : "일책필살",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "천하 만독의 기운이 깃들어 있는 신묘한 보도."	},
        {	"이름" : "만독보도",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 90,	"방어력" : 0,	"순발력" : 0,	"사기" : 21,	"이동력" : 0,	"특수효과" : "방해계책략극대화",	"특수효과수치" : "0.9",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "날에 기린 문양을 새겨놓은 보도. 기린의 힘이 깃들어 있다고 한다."	},
        {	"이름" : "무귀보도",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 86,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속책략",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "무귀도에서 귀법을 사용할 때 쓰이는 주술용 무기."	},
        {	"이름" : "반야보검",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 81,	"방어력" : 0,	"순발력" : 0,	"사기" : 20,	"이동력" : 0,	"특수효과" : "MP절약",	"특수효과수치" : "40",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불교의 힘이 깃든 보검으로 깨달음을 얻을 수 있게 해준다고 한다."	},
        {	"이름" : "백룡 보검",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 90,	"방어력" : 0,	"순발력" : 21,	"사기" : 0,	"이동력" : 0,	"특수효과" : "주동공격",	"특수효과수치" : "",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백룡 문양으로 장식된 보검. 백룡의 힘이 깃들어 있다고 한다."	},
        {	"이름" : "사신보도",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 81,	"방어력" : 0,	"순발력" : 20,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사신의 힘이 깃들어 강력한 주술의 힘을 발휘한다."	},
        {	"이름" : "삼황보도",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 86,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "책략지형무시",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도교에 전해지는 보도로 재앙을 막아주는 힘이 있다고 한다."	},
        {	"이름" : "설화보도",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 90,	"방어력" : 7,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "책략방어율관통",	"특수효과수치" : "0.15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "날에 눈꽃 장식을 새겨놓은 보도. 예리하게 연마되어 칼집에서 뽑으면 그 눈부심에 상대가 당황하기도 한다."	},
        {	"이름" : "적소검",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 90,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "MP공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "한고조 유방의 무기로 칠채주와 구화옥의 차가운 빛이 사람을 서늘하게 하고 칼날은 서릿발과 같다는 보검이다. 검에 두 글자가 전자체로 새겨져 있다."	},
        {	"이름" : "칠성보도",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 81,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "공격능력전환",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "왕윤이 동탁 시해를 위해 조조에게 전달한 제식용 검. 높은 가치가 있다고 전해진다."	},
        {	"이름" : "황룡보도",	"등급" : "7",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 90,	"방어력" : 7,	"순발력" : 14,	"사기" : 0,	"이동력" : 0,	"특수효과" : "일격필살",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황룡 문양으로 장식된 보검. 황룡의 힘이 깃들어 있다고 한다."	},
        {	"이름" : "귀대부",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 0,	"방어력" : 18,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "주위HP회복",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "무귀도에서 귀법을 사용할 때 쓰이는 부인. 장로가 사용했다고 한다."	},
        {	"이름" : "귀면문",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 27,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "호위",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "귀신 얼굴이 그려진 방패. 적의 공격을 자신에게 이끌어 내는 효과가 있다."	},
        {	"이름" : "금은거",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 18,	"정신력" : 0,	"방어력" : 9,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "금은 장식이 화려하게 박힌 사마소의 수레."	},
        {	"이름" : "늑갑영롱사만대",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 0,	"방어력" : 9,	"순발력" : 18,	"사기" : 18,	"이동력" : 0,	"특수효과" : "기마공격강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "매우 단단한 껍질에 사자 형상이 새겨진 허리띠. 여포가 사용했다."	},
        {	"이름" : "다물경",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 9,	"방어력" : 0,	"순발력" : 18,	"사기" : 18,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "80",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "온갖 것이 늘어나 보이는 신기한 거울."	},
        {	"이름" : "만전향",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 27,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사향을 이용하여 만든 향료."	},
        {	"이름" : "묵자",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 36,	"방어력" : 0,	"순발력" : 0,	"사기" : 9,	"이동력" : 0,	"특수효과" : "원소책략강화",	"특수효과수치" : "25",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "병법서. 묵가의 시조 묵자의 이론을 모은 책. 축성, 요격에 대한 내용이 담겨있다."	},
        {	"이름" : "반야심경",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 36,	"방어력" : 9,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "범위책략피해감소",	"특수효과수치" : "0.7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불교의 경전. 신비한 힘이 깃들어 있다."	},
        {	"이름" : "병법 24편",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "보급계책략강화",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 기록한 병법서, 제갈량이 죽고 강유에게 물려준다."	},
        {	"이름" : "산해경",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "풍계책략강화",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "저자 미상의 기서. 산천초목에 깃들며 산과 바다에 사는 요괴와 환상의 동물을 적은 책."	},
        {	"이름" : "상한잡병론",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "화계책략강화",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "저자 미상의 의서. 열병의 치료법이 적혀있으며 총 10권으로 구성되어 있다. 한방 의학의 성전으로 여겨진다."	},
        {	"이름" : "상황내문",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 23,	"정신력" : 23,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "본대각성",	"특수효과수치" : "",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도교에 전해지는 영부의 하나. 모든 재앙을 막아준다고 한다."	},
        {	"이름" : "서촉지형도",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "수계책략강화",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "장송이 은밀히 그린 서촉 5군 41현의 지도. 유비에게 헌상 되었다. 유비의 서촉정벌을 돕기위해 장송이 은밀히 그린 지도로, 익주의 41 지역이 자세히 나와 있다"	},
        {	"이름" : "소요마",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 9,	"방어력" : 9,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "도구범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "한제국 황제인 헌제의 명마."	},
        {	"이름" : "손빈병법",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 45,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격책략강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "병법서. 전국시대 제나라의 병법가 손빈이 지은 병법서. 손빈은 손무의 후예로 알려졌다."	},
        {	"이름" : "양보음보",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "지계책략강화",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 즐겨 부르던 노래의 악보."	},
        {	"이름" : "오룡",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 18,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 9,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조조가 아끼던 애마. 용과 같은 이미지의 흑마. 용의 수염을 연상시키는 수염 같은 흰 줄무늬가 머리에 있다."	},
        {	"이름" : "오추마",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 27,	"정신력" : 0,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "돌진공격",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "원래 용이었으나 말에 모습으로 태어났다는 초패왕 항우 소유의 말."	},
        {	"이름" : "옥새",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 18,	"이동력" : 0,	"특수효과" : "회심공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "진의 시황제가 남전의 고급옥을 사용해 만들게 한 옥새. 황제의 상징에 해당하는 도장이다."	},
        {	"이름" : "위공자병법",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "방해계책략강화",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "병법서. 전국사군의 한사람인 신릉군이 편찬. 제후들에게 기증받은 병법서를 하나로 모았다."	},
        {	"이름" : "육어대",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 0,	"방어력" : 0,	"순발력" : 27,	"사기" : 9,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "150",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전설 속에 나오는 6마리의 커다란 물고기의 비늘로 만든 허리띠. 곽가가 사용했다."	},
        {	"이름" : "육하성",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 18,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "150",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "오나라 수군에서 사용되는 허리띠. 감녕이 애용했다."	},
        {	"이름" : "적로",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 18,	"순발력" : 9,	"사기" : 18,	"이동력" : 0,	"특수효과" : "험로이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "이마에 흰 무늬가 입안으로 들어가 이빨에 이르고, 눈 밑에 눈물주머니가 있는 관상을 가진 말. 유안이라고도 한다. 장무의 말로 유비가 입수한다. 지형 이동력을 무시하고 거침없이 이동한다."	},
        {	"이름" : "전옥사자",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 36,	"사기" : 9,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "150",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹수의 가죽으로 만든 띠에 옥을 장식한 허리띠. 맹획이 사용했다."	},
        {	"이름" : "절영",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 9,	"방어력" : 9,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "이동력보조",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조조의 명마 중 하나로 그림자가 보이지 않을 정도로 빠르게 달리는 연갈색의 명마. 이동력을 높여준다."	},
        {	"이름" : "제갈건",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 9,	"방어력" : 18,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "주위MP회복",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 애용한 두건."	},
        {	"이름" : "청려장",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 18,	"방어력" : 9,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "MP회복",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "남화노선, 우길 등 도인이 주로 사용하던 청색의 지팡이. 책략의 위력을 높여주는 효과가 있다고 한다."	},
        {	"이름" : "취수경",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 9,	"방어력" : 0,	"순발력" : 27,	"사기" : 9,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "80",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "달을 향하여 물을 얻는 거울."	},
        {	"이름" : "취화경",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 36,	"사기" : 9,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "80",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "태양 빛을 모아 불을 얻는 거울."	},
        {	"이름" : "침수향",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 18,	"정신력" : 9,	"방어력" : 18,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "분노축적",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "침향나무를 이용한 향료."	},
        {	"이름" : "흑풍",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 36,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "격파",	"특수효과수치" : "0.3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "온몸이 까만 털로 덮여있는 명마. 움직임이 마치 바람과 같다고 한다."	},
        {	"이름" : "귀화선",	"등급" : "7",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 100,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "화계책략극대화",	"특수효과수치" : "0.9",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "화염의 기운이 깃들어 있다고 전해지는 귀기어린 부채."	},
        {	"이름" : "백학선",	"등급" : "7",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 95,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "연속책략",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신비로운 힘을 가진 접부채. 신기한 요술을 부릴 수 있다고 한다."	},
        {	"이름" : "옥선",	"등급" : "7",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 95,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "MP공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "옥과현의 선장 김희옥이 만든 부채로 옥선이라 하였다. 당시 사람들이 한 자루를 얻으면 구슬처럼 소중히 여길만큼 묘하고 아름다웠다고 한다."	},
        {	"이름" : "차선",	"등급" : "7",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 100,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "MP절약",	"특수효과수치" : "40",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사각형 틀의 한쪽에 천을 붙인 부채. 의식에서 주로 사용되었다."	},
        {	"이름" : "천풍선",	"등급" : "7",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 100,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "풍계책략극대화",	"특수효과수치" : "0.9",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "하늘의 바람을 부릴 수 있게 해준다는 신비로운 부채."	},
        {	"이름" : "흑우선",	"등급" : "7",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 100,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략방어율관통",	"특수효과수치" : "0.15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "까마귀 깃털로 만들어진 부채. 저주받은 요술을 부릴 수 있다고 한다."	},
        {	"이름" : "녹의황리",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 7,	"방어력" : 68,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "순발력보조",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "녹색으로 된 의복."	},
        {	"이름" : "복두공복",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 60,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "피해전가",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "옷깃은 둥글고 소매가 매우 넓은 의복."	},
        {	"이름" : "비룡문의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 71,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "공격방어율증가",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "비룡 자수를 새겨 넣은 의복."	},
        {	"이름" : "사각문의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 7,	"방어력" : 66,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "전방어율증가",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사각 안에 글씨를 새겨 넣은 의복."	},
        {	"이름" : "사각회선문의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 68,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "부동면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사각 회선 안에 글씨를 새겨 넣은 의복."	},
        {	"이름" : "수면문의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 68,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "혼란면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "수면 시 입었던 의복."	},
        {	"이름" : "유승금루옥의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 67,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "방어능력전환",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "중산정왕 유승의 의복. 신비한 힘을 갖고 있다."	},
        {	"이름" : "은경의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 7,	"방어력" : 61,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "MP방어",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "은색 고래 자수를 새겨 넣은 의복."	},
        {	"이름" : "은철금의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 7,	"방어력" : 68,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "은과 철로 자수를 새겨 넣은 금빛 의복."	},
        {	"이름" : "이중원문호복",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 7,	"방어력" : 66,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "책략피해반사",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "이중 원안에 호를 새겨 넣은 의복."	},
        {	"이름" : "적룡문의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 7,	"방어력" : 67,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "적룡 자수를 새겨 넣은 의복."	},
        {	"이름" : "직거소사선의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 67,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "연속공격면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "매우 정교한 직조기술로 만들어져 매미의 날개같이 가벼운 의복."	},
        {	"이름" : "청라의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 70,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상반사",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "좌자가 애용한 청색으로 된 의복."	},
        {	"이름" : "청초의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 7,	"방어력" : 68,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "책략방어율증가",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청색 풀을 자수로 새겨 넣은 의복."	},
        {	"이름" : "파문의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 68,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "중독면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "파문 시 입었던 의복."	},
        {	"이름" : "학창의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 63,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "회심공격면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 애용한 학의 털로 짠 의복."	},
        {	"이름" : "한복",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 68,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "연속책략면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "한족 특유의 전통 의복."	},
        {	"이름" : "흑룡문의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 7,	"방어력" : 70,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "150",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "흑룡 자수를 새겨 넣은 의복."	},
        {	"이름" : "구석",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "책략피해반사",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황제가 특별히 공을 세운 사람에게 하사했던 9종류의 물품 중 의복이다."	},
        {	"이름" : "기린전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 7,	"정신력" : 0,	"방어력" : 80,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "운기조식",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "기린 자수를 수놓은 전포."	},
        {	"이름" : "매화 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 76,	"순발력" : 7,	"사기" : 10,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "150",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "매화꽃을 새겨 넣은 전포."	},
        {	"이름" : "백금란의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 76,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "연속공격면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전위가 사용하던 전포."	},
        {	"이름" : "백룡 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 75,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "MP방어",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백룡 자수를 새겨 넣은 전포."	},
        {	"이름" : "백운 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 7,	"방어력" : 80,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략피해감소",	"특수효과수치" : "0.35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "구름 무늬 자수를 수놓은 순백의 전포."	},
        {	"이름" : "백초중단",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 76,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조복, 제복을 입을 때 속에 받쳐입는 포."	},
        {	"이름" : "백호 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 79,	"순발력" : 7,	"사기" : 10,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백호 자수를 새겨 넣은 전포."	},
        {	"이름" : "상구",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 80,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "전방어율증가",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "코끼리 가죽으로 만든 전포."	},
        {	"이름" : "서촉홍금백화",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 20,	"사기" : 0,	"이동력" : 0,	"특수효과" : "물리피해반사",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "여포가 애용하던 전포."	},
        {	"이름" : "수리 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 74,	"순발력" : 7,	"사기" : 10,	"이동력" : 0,	"특수효과" : "순발력보조",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "수리 자수를 새겨 넣은 전포."	},
        {	"이름" : "자색힐문금의",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 76,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속책략면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "자줏빛의 대지의 무늬가 비단으로 수 놓인 의상."	},
        {	"이름" : "주작 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 77,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상반사",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주작 자수를 새겨 넣은 전포."	},
        {	"이름" : "천금구",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 0,	"사기" : 20,	"이동력" : 0,	"특수효과" : "부동면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "여우 가죽으로 만든 값비싼 전포."	},
        {	"이름" : "청산 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 77,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "회심공격면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청산을 새겨 넣은 전포."	},
        {	"이름" : "풍신 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 80,	"순발력" : 14,	"사기" : 0,	"이동력" : 0,	"특수효과" : "피해분배",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "풍신의 기운이 깃든 전포."	},
        {	"이름" : "현무 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 71,	"순발력" : 10,	"사기" : 20,	"이동력" : 0,	"특수효과" : "피해전가",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "현무 자수를 새겨 넣은 전포."	},
        {	"이름" : "홍금포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 80,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "중독면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹획이 사용한 전포."	},
        {	"이름" : "황룡 전포",	"등급" : "7",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 77,	"순발력" : 7,	"사기" : 10,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황룡 자수를 새겨 넣은 전포."	},
        {	"이름" : "금정개산월",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 110,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "공손찬이 애용한 창으로 넓은 범위에 신속히 상처를 입힐 수 있다."	},
        {	"이름" : "대협도",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 101,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "선제공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "날이 협소한 언월도."	},
        {	"이름" : "독룡부",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 113,	"정신력" : 0,	"방어력" : 0,	"순발력" : 14,	"사기" : 10,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독룡 문양으로 장식된 대부."	},
        {	"이름" : "맹독월도",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 114,	"정신력" : 0,	"방어력" : 0,	"순발력" : 14,	"사기" : 10,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹독의 기운이 서려있는 언월도."	},
        {	"이름" : "백호부",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 91,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "주동공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백호 문양으로 장식된 대부."	},
        {	"이름" : "애각창",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "인도공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조운이 애용했다고 전해지는 장창으로 길이가 9척에 달한다."	},
        {	"이름" : "어골창",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "회심공격강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "하후돈이 애용했다고 전해지는 창. 어골로 만든 긴 창이다."	},
        {	"이름" : "예당파",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 125,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "기습공격",	"특수효과수치" : "0.03",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제련을 거듭하여 창 끝 날이 예리한 장창"	},
        {	"이름" : "장팔사모",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "피해범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "장비가 애용하는 8척 길이의 모. 뱀이 굽이치는 모양으로 된 칼날이 달려있다. 창을 든 손에서 뻗쳐나가는 일격으로 2부대를 찔러 공격할 수 있다."	},
        {	"이름" : "주작부",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 103,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주작 문양으로 장식된 대부."	},
        {	"이름" : "첨당파",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 98,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창 끝 날이 가늘고 길은 장창."	},
        {	"이름" : "청룡구겸도",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 125,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "선제공격면역",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "날의 앞부분에 청룡의 문양을 새겨놓은 끝이 갈라진 창."	},
        {	"이름" : "청룡부",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "재반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청룡 문양으로 장식된 대부."	},
        {	"이름" : "청룡언월도",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 110,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "무반격공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "관우가 애용하는 대도. 무게가 82근이나 나갔다고 한다. 위협적인 박력으로 적의 반격을 무력화할 수 있다."	},
        {	"이름" : "초진창",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 20,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "패왕 항우가 사용했다고 전해지는 창으로 공격과 방어 모두 뛰어난 기능을 발휘한다."	},
        {	"이름" : "치익월아당",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 94,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 20,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "중앙의 창날은 적을 찌르고 좌우로 나와있는 창날은 주로 적의 공격을 방어하는 데 사용하는 공방 일체의 무기이다."	},
        {	"이름" : "혼천절",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 94,	"정신력" : 0,	"방어력" : 0,	"순발력" : 20,	"사기" : 10,	"이동력" : 0,	"특수효과" : "흡혈공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창끝은 사첨양인의 칼날이 붙어 있고 옆으로 네 방향에 월아가 부착되어 찔렀을 때 많은 상처를 입힐 수 있는 특수 병기."	},
        {	"이름" : "화첨창",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 20,	"이동력" : 0,	"특수효과" : "파진공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "자유롭게 길이가 늘고 줄며 불을 뿜어내는 전설 속의 창. 불의 신 화광대제의 무기로 나타의 보패로 알려져 있다."	},
        {	"이름" : "황룡언월도",	"등급" : "7",	"종류" : "무기",	"종류2" : "창",	"공격력" : 125,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "일격필살",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "날에 황룡 장식을 새겨넣은 언월도. 80근의 무게로 그 위력은 청룡언월도에 버금간다고 한다."	},
        {	"이름" : "금전",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "금책공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "화광이 소유한 것으로 알려진 황금으로 만들어진 벽돌 모양을 한 보패."	},
        {	"이름" : "금화관포",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "고열로 액화된 금속을 넣은 탄을 발사하는 포. 발화의 부가 효과가 있다."	},
        {	"이름" : "대루",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 15,	"사기" : 0,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "근접 공격에도 대응할 수 있도록 제작한 포."	},
        {	"이름" : "대완구",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "기습공격",	"특수효과수치" : "0.03",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "휴대성을 강화한 유통식 화포."	},
        {	"이름" : "동자",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 15,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "포대를 동과 옥으로 제작한 포."	},
        {	"이름" : "맹화유궤",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 110,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "석유를 원료로 사용하는 고성능 화염방사기. 한 번 불이 붙으면 꺼지지 않고 계속 화염을 분사한다."	},
        {	"이름" : "목만",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 80,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "주동공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "성곽의 방어 시설을 파괴하는 용도로 제작한 포."	},
        {	"이름" : "반고번",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "원시천존이 사용했다고 알려진 전설의 포."	},
        {	"이름" : "소차",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 82,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "무반격공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "이동력을 강화하기 위해 기존 포 보다 작게 제작한 포."	},
        {	"이름" : "용준포",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 87,	"정신력" : 0,	"방어력" : 0,	"순발력" : 15,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "용 문양을 새겨 넣어 제작한 포."	},
        {	"이름" : "운제포",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 80,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "선제공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사다리를 탑재하여 전략적인 작전을 수행하기 위해 제작한 포."	},
        {	"이름" : "지자총통",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "일격필살",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "두번째로 큰 총통으로 장군전과 철환을 발사하는 용도로 사용된 포. 매우 강력한 위력을 자랑하며, 적선을 격파시키는데 주로 사용하였다."	},
        {	"이름" : "첨두석로",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 87,	"정신력" : 0,	"방어력" : 0,	"순발력" : 15,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "35",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "첨두목로를 개량하여 돌을 깎아 제작한 포."	},
        {	"이름" : "팔전총통",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 80,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "재반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "8발을 동시에 발사할 수 있는 포"	},
        {	"이름" : "현자총통",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 85,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속반격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철환을 발사할 수 있는 포."	},
        {	"이름" : "황자총통",	"등급" : "7",	"종류" : "무기",	"종류2" : "포",	"공격력" : 70,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "현자총통을 개량한 포."	},
        {	"이름" : "동미늘갑",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 85,	"순발력" : 7,	"사기" : 12,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "동판을 엮어 만든 갑옷."	},
        {	"이름" : "동피갑주",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 85,	"순발력" : 15,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략방어율증가",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "동판을 가죽끈으로 엮어 만든 갑주."	},
        {	"이름" : "명광개",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 86,	"순발력" : 0,	"사기" : 14,	"이동력" : 0,	"특수효과" : "간접피해감소",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "거울과 같이 매끈하게 만들어진 갑옷."	},
        {	"이름" : "사사을갑주",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 95,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "물리피해반사",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "진흙과 범의 뼈를 이용해 만든 찰갑."	},
        {	"이름" : "양당갑",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 86,	"순발력" : 14,	"사기" : 0,	"이동력" : 0,	"특수효과" : "물리피해감소",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "기병들이 주로 사용하였으며, 신체의 앞면을 보호하는 흉갑과 등을 보호하는 배갑으로 나뉜다."	},
        {	"이름" : "양백갑",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "순발력보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "양백의 기운이 깃들어진 갑옷."	},
        {	"이름" : "양황갑",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 105,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "100",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "양황의 기운이 깃들어진 갑옷."	},
        {	"이름" : "유엽갑",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "책략피해감소",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "연녹비를 엮어서 흑칠을 한 갑옷."	},
        {	"이름" : "은흉갑",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 12,	"사기" : 0,	"이동력" : 0,	"특수효과" : "전방어율증가",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가슴에 대는 보호대로 은을 부착해서 제작."	},
        {	"이름" : "정백갑",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 100,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정백의 기운이 깃들어진 갑옷."	},
        {	"이름" : "증장천갑",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 86,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "책략피해반사",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불교의 사천왕 중 남방을 맡은 증장천왕의 갑옷. 신비한 힘이 깃들어 있다."	},
        {	"이름" : "철갑주",	"등급" : "6",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격방어율증가",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "무쇠를 이용해 만든 찰갑."	},
        {	"이름" : "거궐",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "금구공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국시대에 월나라의 명인 구야자가 월왕 윤상의 명에 따라 만든 다섯 자루의 명검 중 하나. 거칠고 이가 빠진 검신을 갖고 있으나 무엇보다도 예리하다."	},
        {	"이름" : "남도",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 102,	"정신력" : 5,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "남도 장군이 사용하던 검."	},
        {	"이름" : "담로",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국시대에 월나라의 명인 구야자가 월왕 윤상의 명에 따라 만든 다섯 자루의 명검 중 하나로 희광에게 전해진 세 자루 중 하나."	},
        {	"이름" : "순구",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "금책공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국시대에 월나라의 명인 구야자가 월왕 윤상의 명에 따라 만든 다섯 자루의 명검 중 하나로 희광에게 전해진 세 자루 중 하나이며, 순균이라고도 부른다."	},
        {	"이름" : "승사",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 86,	"정신력" : 7,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국시대에 월나라의 명인 구야자가 월왕 윤상의 명에 따라 만든 다섯 자루의 명검 중 하나."	},
        {	"이름" : "쌍룡검",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "회심공격강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "군용 환도로써 장군이 이용하던 명검."	},
        {	"이름" : "어장",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 86,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국시대에 월나라의 명인 구야자가 월왕 윤상의 명에 따라 만든 다섯 자루의 명검 중 하나로 희광에게 전해진 세 자루 중 하나. 연운이라고도 한다. 연한 구름 그림이 있다."	},
        {	"이름" : "요도",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 107,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "요물의 기운이 서려있는 검."	},
        {	"이름" : "우미도",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도선의 날카로운 곡선 형태가 아름다운 환도."	},
        {	"이름" : "원융검",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 90,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "흡혈공격",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "대장군이 사용한다는 명검."	},
        {	"이름" : "토유검",	"등급" : "6",	"종류" : "무기",	"종류2" : "검",	"공격력" : 105,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독의 기운이 서려있는 검."	},
        {	"이름" : "강철수극",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 92,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "금구공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "강철로 제작한 짧은 극."	},
        {	"이름" : "건곤권",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "회심공격강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "손상향 소유의 권. 한 손으로 들 수 있는 원형의 날붙이에 월아가 붙어 있다."	},
        {	"이름" : "금책은곤",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 92,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "금책공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "은으로 제작하여 도술을 봉인할 수 있는 곤."	},
        {	"이름" : "독사추",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 95,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독사 문양으로 장식된 곤."	},
        {	"이름" : "맹독극",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 91,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독의 기운이 서려있는 극"	},
        {	"이름" : "묵언추",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 92,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "말보다 빠르게 휘두를 수 있는 극."	},
        {	"이름" : "반혼봉",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 92,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "반혼이 빠져나갈 듯한 악령이 서려있는 봉."	},
        {	"이름" : "석월장",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 81,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사오정이 사용했다고 전해지는 사슬을 마음대로 조종하는 무기."	},
        {	"이름" : "이능극",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 87,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "남다른 재능으로 만든 강력한 극."	},
        {	"이름" : "제비추",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 86,	"정신력" : 7,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "추를 제비 모양으로 제작한 유성추."	},
        {	"이름" : "철질려골타",	"등급" : "6",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 81,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "흡혈공격",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창의 일종. 끝에 철침이 무수히 박혀 있다. 사마가가 애용했다."	},
        {	"이름" : "금비전",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "금책공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황금으로 장식된 헌제 소유의 활. 매우 아름답다."	},
        {	"이름" : "독사궁",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 113,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "활대 끝을 독사로 장식한 활."	},
        {	"이름" : "매화궁",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 103,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "매화 문양이 새겨져 있는 활."	},
        {	"이름" : "맹독비전",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 111,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독의 기운이 서려있는 활."	},
        {	"이름" : "묵언궁",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 111,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "금구공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "말보다 빠르게 화살을 발사할 수 있는 활."	},
        {	"이름" : "반혼궁",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 107,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "반혼이 빠져나갈 듯한 악령이 서려있는 활."	},
        {	"이름" : "수전",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 111,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "활대의 탄력을 강화한 활."	},
        {	"이름" : "이능궁",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 111,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "남다른 재능으로 만든 강력한 활."	},
        {	"이름" : "작화궁",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 81,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "회심공격강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "손견이 호로관 싸움에서 화웅과 싸울 때 사용한 활. 타오르는 듯한 붉은 문양이 인상적이다."	},
        {	"이름" : "주박궁",	"등급" : "6",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 111,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "박달나무로 만든 단단한 활."	},
        {	"이름" : "독사노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독사로 장식한 노."	},
        {	"이름" : "매화노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 5,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "매화 문양이 새겨져 있는 노."	},
        {	"이름" : "맹독노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 5,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독의 기운이 서려있는 노."	},
        {	"이름" : "묵언노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 5,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "금구공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "말보다 빠르게 화살을 발사할 수 있는 노."	},
        {	"이름" : "반혼노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "반혼이 빠져나갈 듯한 악령이 서려있는 노."	},
        {	"이름" : "수궁노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "금책공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈노의 개량판. 연사가 가능하고 각궁과 결합해 파괴력을 높였다. 10~20개의 화살이 담긴 전갑에서 발사와 동시에 다음 시위가 자동장전된다."	},
        {	"이름" : "양유기노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "회심공격강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백발백중이란 말의 어원이 된 춘추시대 초나라 명사수 양유기의 노."	},
        {	"이름" : "용두삼시수노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "3연발 연노. 한 번에 3연발로 발사하며 자동 장전된다. 앞부리가 길고 각궁과 결합하여 발사 안정성이 높은 대신 연사 속도가 떨어진다."	},
        {	"이름" : "이능노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "남다른 재능으로 만든 강력한 노."	},
        {	"이름" : "질려노",	"등급" : "6",	"종류" : "무기",	"종류2" : "노",	"공격력" : 100,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "질려를 가공해 만든 기를 사용하는 노."	},
        {	"이름" : "금강보검",	"등급" : "6",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 77,	"방어력" : 0,	"순발력" : 0,	"사기" : 14,	"이동력" : 0,	"특수효과" : "책략명중률증가",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불교의 승려들이 종교행사에 사용하는 보검으로 불경의 힘이 깃들어 있다."	},
        {	"이름" : "사인참사검",	"등급" : "6",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 81,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속책략강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "천시를 따져 인, 즉 호랑이의 기운을 받아 만든 검이다. 장인이 최소 반년 이상 몸을 정갈히 하고, 인년 인월 인일 인시에 만들어 낸다. 장인 한 사람이 평생에 걸쳐 한 자루밖에 만들지 않는다."	},
        {	"이름" : "사진참사검",	"등급" : "6",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 86,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "MP절약",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "천시를 따져 진, 즉 용의 기운을 받아 만든 검이다. 장인이 최소 반년 이상 몸을 정갈히 하고, 진년 진월 진일 진시에 만들어 낸다. 장인 한 사람이 평생에 걸쳐 한 자루밖에 만들지 않는다."	},
        {	"이름" : "청봉보검",	"등급" : "6",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 77,	"방어력" : 0,	"순발력" : 14,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격책략강화",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도교의 팔보로 악을 다스리고 병을 치료하는 신비한 힘을 상징하는 보검."	},
        {	"이름" : "촉루지검",	"등급" : "6",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 81,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국시대에 월나라의 명인 구야자가 만들었으며 자살하라는 의미가 있다. 저주받은 힘이 깃들어 군주가 신하를 죽게 한다는 보검."	},
        {	"이름" : "건상역주",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 21,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "보급계책략강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "감택이 저술한 논문. 달력과 계절을 일치시켰으며 손권이 오의 역법으로 채용하였다."	},
        {	"이름" : "구국론",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 21,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "방해계책략강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "초주의 저서. 유선 시대에 전쟁의 이득과 손해에 대해 저술하였다."	},
        {	"이름" : "난초유",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 21,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "난초를 기름에 담아 사용하는 향료."	},
        {	"이름" : "목우",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 14,	"정신력" : 0,	"방어력" : 7,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "4",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 개발한 다인용 수레. 병기나 보급물자를 운송하는 용도로 개발되었다."	},
        {	"이름" : "백룡",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 14,	"순발력" : 7,	"사기" : 14,	"이동력" : 0,	"특수효과" : "험로이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "흰색 갈기를 가진 백마로 뛰는 모습이 마치 용과 같다고 한다."	},
        {	"이름" : "사민월령",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 7,	"정신력" : 0,	"방어력" : 14,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "주위HP회복",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정서. 후한시대 최식이 편찬한 책. 한대의 절기와 농사에 대해 저술하였다."	},
        {	"이름" : "산반",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 14,	"방어력" : 7,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "MP회복",	"특수효과수치" : "4",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주판이라고도 한다. 숫자를 계산하기 위해 사용하는 계산기."	},
        {	"이름" : "상군서",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 21,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "화계책략강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정서. 전국시대 진나라의 재상 상앙이 저술한 책으로 엄격한 법치주의로 유명하다."	},
        {	"이름" : "서광경",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 7,	"방어력" : 0,	"순발력" : 14,	"사기" : 14,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "50",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "등잔을 비추면 밤에도 그 빛이 몇 리 밖을 비추며, 그 빛을 쬐면 겨울에도 태양을 낀 듯 온몸이 따뜻해진다는 거울."	},
        {	"이름" : "설립대",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 7,	"정신력" : 0,	"방어력" : 0,	"순발력" : 21,	"사기" : 7,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "100",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "순백색의 끈을 엮어서 만든 허리띠."	},
        {	"이름" : "신헌육구갑사대",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 7,	"정신력" : 0,	"방어력" : 0,	"순발력" : 14,	"사기" : 14,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "100",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "항복한 가후에게 조조가 하사한 허리띠."	},
        {	"이름" : "영보경",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 21,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "수계책략강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도교 경전의 하나. 좌자가 전한 것으로 진의 갈홍이 포박자에 정리했다."	},
        {	"이름" : "오악진형도",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 35,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격책략강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도교에 전해지는 영부의 하나. 부정함을 물리치고 백 가지 복을 늘려준다고 한다."	},
        {	"이름" : "옥란백용구",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 14,	"사기" : 7,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조운 소유의 말. 화려한 갈기에 흰 털의 백마."	},
        {	"이름" : "은안백마",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 7,	"정신력" : 7,	"방어력" : 7,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "도구범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조조 소유의 말. 눈까지 은색인 설백마. 굉장히 아낌을 받았다고 한다. 명마로서의 성능은 조금 떨어진다."	},
        {	"이름" : "을려대",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 28,	"사기" : 7,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "100",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "고순이 사용한 허리띠. 여포가 함진영 군대에 하사하였다."	},
        {	"이름" : "응정금관",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 7,	"방어력" : 14,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "주위MP회복",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "유표가 애용한 관. 매의 부리와 금으로 화려하게 장식되어있다."	},
        {	"이름" : "임화경",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 7,	"방어력" : 0,	"순발력" : 21,	"사기" : 7,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "50",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "한쪽 면에 무늬를 조각한 거울."	},
        {	"이름" : "전단향",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 14,	"정신력" : 7,	"방어력" : 14,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "분노축적",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전단의 목재나 뿌리를 분말로 한 향료."	},
        {	"이름" : "천리경",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 28,	"사기" : 7,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "50",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "천 리가 비치는 신기한 거울."	},
        {	"이름" : "춘추",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 21,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "풍계책략강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "경서. 유교의 오경의 하나."	},
        {	"이름" : "칠성저",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 7,	"정신력" : 0,	"방어력" : 7,	"순발력" : 14,	"사기" : 14,	"이동력" : 0,	"특수효과" : "기마공격강화",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "칠성기도 의식에 사용하는 허리띠. 강유가 사용했다."	},
        {	"이름" : "황제사경",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 21,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "지계책략강화",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도교 경전의 하나. 한대의 통치자가 중시한 황로학이 적혀있다."	},
        {	"이름" : "효경전",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 28,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "원소책략강화",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "시경, 서경, 삼례에 통달한 엄준이 저술한 논문."	},
        {	"이름" : "흑달마",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 7,	"정신력" : 7,	"방어력" : 7,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "이동력보조",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "검은 털에 누런 갈기를 띤 허저 소유의 말."	},
        {	"이름" : "흑혈",	"등급" : "6",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 21,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "돌진공격",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조조 소유의 말. 흰 갈기에 검은 명마. 힘이 매우 좋아 전장에서 돌격할 때 그 위력을 발휘했다."	},
        {	"이름" : "대륜선",	"등급" : "6",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 86,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "책략명중률증가",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "부채와 양산을 겸하는 독특한 부채. 부채보다는 양산의 용도로 활용되었다."	},
        {	"이름" : "봉익선",	"등급" : "6",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 95,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속책략강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "봉황의 날개로 만든 부채."	},
        {	"이름" : "오명선",	"등급" : "6",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 90,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "MP절약",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 중국의 순 임금이 요 임금의 선위를 받아 임금이 된 뒤, 현인을 구해 문견을 넓히고자 만든 부채. 신기한 힘을 갖고 있다."	},
        {	"이름" : "초량선",	"등급" : "6",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 90,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "원소책략강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 주나라 무왕이 만든 부채."	},
        {	"이름" : "구장복",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 63,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "물리피해감소",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "왕이 면복을 갖추어 입을 때 입던 옷."	},
        {	"이름" : "금관조복",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 67,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략피해감소",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "왕이 제사를 지낼 때 문무백관이 입는 배사복."	},
        {	"이름" : "동철금의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 5,	"방어력" : 65,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "동과 철로 자수를 새겨 넣은 금빛 의복."	},
        {	"이름" : "백룡문의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 7,	"방어력" : 65,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "100",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백룡 자수를 새겨 넣은 의복."	},
        {	"이름" : "봉황문의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 66,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격방어율증가",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "봉황 자수를 새겨 넣은 의복."	},
        {	"이름" : "삼각문의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 5,	"방어력" : 63,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "전방어율증가",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "삼각 안에 글씨를 새겨 넣은 의복."	},
        {	"이름" : "심의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 60,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "물리피해반사",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사마광이 애용한 옷. 건곤, 4계, 12월을 상징한다."	},
        {	"이름" : "원문호복",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 5,	"방어력" : 63,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략피해반사",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "원안에 호를 새겨 넣은 의복."	},
        {	"이름" : "적의청리",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 5,	"방어력" : 61,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "순발력보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "적색으로 된 의복."	},
        {	"이름" : "적초의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 5,	"방어력" : 64,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략방어율증가",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "적색 풀을 자수로 새겨 넣은 의복."	},
        {	"이름" : "중치막",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 63,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "간접피해감소",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신분이 높은 관리들이 입던 3 자락의 겉옷."	},
        {	"이름" : "황룡문의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 5,	"방어력" : 64,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황룡 자수를 새겨 넣은 의복."	},
        {	"이름" : "낙구",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "물리피해감소",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "낙타 가죽으로 만든 전포. 실크로드를 통해 전파되었다."	},
        {	"이름" : "낙복",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 76,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "간접피해감소",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "낙타 털로 만든 의상. 실크로드를 통해 전파되었다."	},
        {	"이름" : "맹호 전포",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 75,	"순발력" : 3,	"사기" : 5,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹호 자수를 새겨 넣은 전포."	},
        {	"이름" : "백화 전포",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 3,	"사기" : 5,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "100",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "하얀 꽃을 새겨 넣은 전포."	},
        {	"이름" : "서우피 전포",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 69,	"순발력" : 0,	"사기" : 14,	"이동력" : 0,	"특수효과" : "책략방어율증가",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "코뿔소 가죽으로 만든 전포."	},
        {	"이름" : "수우피 전포",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "전방어율증가",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "물소 가죽으로 만든 전포."	},
        {	"이름" : "오색금의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "책략피해반사",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "금명의 일종으로 오색의 자수가 박힌 화려한 의상."	},
        {	"이름" : "운포금의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 69,	"순발력" : 14,	"사기" : 0,	"이동력" : 0,	"특수효과" : "책략피해감소",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "비단으로 구름무늬를 수놓은 의상."	},
        {	"이름" : "제비 전포",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 71,	"순발력" : 3,	"사기" : 5,	"이동력" : 0,	"특수효과" : "순발력보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제비 자수를 새겨 넣은 전포."	},
        {	"이름" : "질손",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "공격방어율증가",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "마상의로서 옆에 주름이 달린 직령의 협수포. 북방 민족의 옷"	},
        {	"이름" : "청룡 전포",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 73,	"순발력" : 3,	"사기" : 5,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청룡 자수를 새겨 넣은 전포."	},
        {	"이름" : "허저족의",	"등급" : "6",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 76,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "물리피해반사",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "어피로 만든 전포로 얇고 반짝거리는 것이 특징이다."	},
        {	"이름" : "강요보장",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "금구공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사오정이 사용했다고 알려진 창."	},
        {	"이름" : "개산대부",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 14,	"사기" : 0,	"이동력" : 0,	"특수효과" : "능력이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "거대한 도끼. 한덕, 형도영이 애용했다고 한다."	},
        {	"이름" : "금마삭",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 14,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "1장 8척의 기병용 장창. 돌격용 중량무기로 마초가 애용했다."	},
        {	"이름" : "독사부",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 103,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 5,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독사 문양으로 장식된 대부."	},
        {	"이름" : "복익극",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 89,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 14,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창 놀림이 가벼우나 단단하며, 칼날 옆에 박쥐 날개 모양의 칼날이 양쪽에 달려있다."	},
        {	"이름" : "사모",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창끝이 2갈래로 갈라진 이랑도."	},
        {	"이름" : "점강모",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 7,	"이동력" : 0,	"특수효과" : "금책공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "길이가 길고 가벼우며, 창끝이 갈라진 모."	},
        {	"이름" : "중독월도",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 104,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 5,	"이동력" : 0,	"특수효과" : "맹독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "독의 기운이 서려있는 언월도."	},
        {	"이름" : "허도부",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "회심공격강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "위나라 장수들이 애용하던 대형 도끼."	},
        {	"이름" : "호룡담",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 89,	"정신력" : 0,	"방어력" : 0,	"순발력" : 14,	"사기" : 7,	"이동력" : 0,	"특수효과" : "흡혈공격",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "상산의 조운이 사용했다고 전해지는 창. 호랑이와 용의 담력을 가질 수 있다고 한다."	},
        {	"이름" : "화염부",	"등급" : "6",	"종류" : "무기",	"종류2" : "창",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "반봉과 유섭이 애용했던 도끼. 상처 부위가 화상을 입은 것처럼 된다고 하여 이런 이름이 붙었다."	},
        {	"이름" : "동옥",	"등급" : "6",	"종류" : "무기",	"종류2" : "포",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속공격강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "포대를 동으로 제작한 포."	},
        {	"이름" : "봉황포",	"등급" : "6",	"종류" : "무기",	"종류2" : "포",	"공격력" : 85,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "상태이상공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "봉황 문양을 새겨 넣어 제작한 포."	},
        {	"이름" : "선풍오포",	"등급" : "6",	"종류" : "무기",	"종류2" : "포",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 7,	"사기" : 0,	"이동력" : 0,	"특수효과" : "금구공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "선풍포 5문을 오각형 모양으로 배치해 각각의 방향에 대응해 발사하게 만든 포."	},
        {	"이름" : "선풍차포",	"등급" : "6",	"종류" : "무기",	"종류2" : "포",	"공격력" : 105,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "중독공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "선풍포를 수레에 장착시켜 이동성을 극대화한 석탄포."	},
        {	"이름" : "임충",	"등급" : "6",	"종류" : "무기",	"종류2" : "포",	"공격력" : 84,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "부동공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "수레에 바퀴를 달아 이동력을 강화한 포."	},
        {	"이름" : "첨두목로",	"등급" : "6",	"종류" : "무기",	"종류2" : "포",	"공격력" : 85,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "혼란공격",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "화공에 대비하여 제작한 포."	},
        {	"이름" : "회회포",	"등급" : "6",	"종류" : "무기",	"종류2" : "포",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 7,	"이동력" : 0,	"특수효과" : "회심공격강화",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "지레의 원리를 응용한 것이지만 그때까지 인력을 이용했던 것을 돌과 같은 추에 의해 발사하도록 개량한 것이다. 양양포 라고도 한다."	},
        {	"이름" : "광목천갑",	"등급" : "5",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 81,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불교의 사천왕 중 서방을 맡은 광목천왕의 갑옷. 신비한 힘이 깃들어 있다."	},
        {	"이름" : "도금동엽갑주",	"등급" : "5",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 81,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "금속제 미늘을 가죽끈으로 연결한 찰갑."	},
        {	"이름" : "두정갑",	"등급" : "5",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 90,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "놋쇠로 된 못을 박아 만든 갑옷."	},
        {	"이름" : "방호갑",	"등급" : "5",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 86,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "적의 화살이나 창·검으로부터 몸을 보호하기 위하여 안에 두꺼운 철판을 대어 만든 갑옷."	},
        {	"이름" : "수은갑",	"등급" : "5",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 86,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철편으로 찰을 하고 수은을 올려서 가죽으로 엮어서 만든 갑옷."	},
        {	"이름" : "황금쇄자갑",	"등급" : "5",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 81,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황금으로 만든 쇄자갑의 일종."	},
        {	"이름" : "간장",	"등급" : "5",	"종류" : "무기",	"종류2" : "검",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "춘추 시대 간장이 만든 두 자루의 명검 중 하나. 간장은 도장의 이름을 따서 만들었으며 양의 기운을 갖고 있다."	},
        {	"이름" : "공포",	"등급" : "5",	"종류" : "무기",	"종류2" : "검",	"공격력" : 81,	"정신력" : 5,	"방어력" : 0,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국시대에 월나라의 명인 구야자가 간장과 함께 초소왕의 명으로 만들었다는 세 자루의 검 중 하나."	},
        {	"이름" : "막야",	"등급" : "5",	"종류" : "무기",	"종류2" : "검",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "춘추 시대 간장이 만든 두 자루의 명검 중 하나. 막야는 그의 아내의 이름을 따서 만들었으며 음의 기운을 갖고 있다."	},
        {	"이름" : "용연",	"등급" : "5",	"종류" : "무기",	"종류2" : "검",	"공격력" : 81,	"정신력" : 5,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국시대에 월나라의 명인 구야자가 간장과 함께 초소왕의 명으로 만들었다는 세 자루의 검 중 하나. 용천이라고도 불린다."	},
        {	"이름" : "절선검",	"등급" : "5",	"종류" : "무기",	"종류2" : "검",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신선을 죽이는 무기인 사선검의 하나."	},
        {	"이름" : "태아",	"등급" : "5",	"종류" : "무기",	"종류2" : "검",	"공격력" : 81,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국시대에 월나라의 명인 구야자가 간장과 함께 초소왕의 명으로 만들었다는 세 자루의 검 중 하나."	},
        {	"이름" : "함선검",	"등급" : "5",	"종류" : "무기",	"종류2" : "검",	"공격력" : 86,	"정신력" : 5,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신선을 죽이는 무기인 사선검의 하나."	},
        {	"이름" : "쌍철극",	"등급" : "5",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 81,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조조군의 맹장 전위가 사용했던 두 자루가 한 쌍인 극. 월아가 단면에만 붙어 있다."	},
        {	"이름" : "오구비도",	"등급" : "5",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 77,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹획과 축융이 애용한 단검으로 주로 품속에 숨겼다가 암기 또는 비상시에 사용한다."	},
        {	"이름" : "질려봉",	"등급" : "5",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 73,	"정신력" : 5,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "강유가 애용한 봉. 끝에 철로 된 가시와 못이 박혀 고슴도치의 털처럼 생겼다."	},
        {	"이름" : "철과추",	"등급" : "5",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 77,	"정신력" : 5,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "끝이 참외 모양의 철재로 만들어진 긴 손잡이가 달린 쇠망치."	},
        {	"이름" : "맥궁",	"등급" : "5",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 77,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "쇠붙이나 동물의 뿔로 만든 각궁으로 소수맥이라는 부족이 사용했다."	},
        {	"이름" : "양석철태궁",	"등급" : "5",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 81,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "간옹과 왕쌍이 애용한 철태로 둘러쌓인 활. 방어 시에도 유용하다."	},
        {	"이름" : "대황",	"등급" : "5",	"종류" : "무기",	"종류2" : "노",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전한의 명장인 이광이 흉노족과 싸울 때 사용했다고 전해지는 노. 이것으로 수많은 흉노족의 부장들을 살해했다고 한다."	},
        {	"이름" : "십시노",	"등급" : "5",	"종류" : "무기",	"종류2" : "노",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 개발한 한 번에 화살 10개를 발사할 수 있는 다연발 노. 원융 혹은 제갈노라고도 한다. 동시에 복수의 적에게 피해를 준다."	},
        {	"이름" : "팔우노",	"등급" : "5",	"종류" : "무기",	"종류2" : "노",	"공격력" : 90,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "여러 사람이 고정 설치하여 발사하는 강력한 노. 공성 무기로 유효하다."	},
        {	"이름" : "곤오적도",	"등급" : "5",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 77,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주나라 곤오국의 보도로 한 번 내려치면 옥돌이 진흙처럼 잘린다. 땅의 기운이 깃들어 있다."	},
        {	"이름" : "용광검",	"등급" : "5",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 81,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "해모수의 삼신기 중 하나로 태양의 힘을 쓸 수 있는 신검."	},
        {	"이름" : "재상검",	"등급" : "5",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 73,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국 시대의 보검으로 장량이 소하에게 판매하였다. 관인대도를 지닌 자에게 어울리는 보검."	},
        {	"이름" : "천자검",	"등급" : "5",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 77,	"방어력" : 0,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전국 시대의 보검으로 장량이 유방에게 판매하였다. 인효 총명과 경강 검학을 지닌 자에게 어울리는 제왕의 덕이 깃든 보검."	},
        {	"이름" : "칠지도",	"등급" : "5",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 73,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "검 좌우에 각 3개씩의 가지 검이 붙어 있으며, 대왕의 지위를 상징하는 보도이다. 모든 병해를 물리칠 힘이 깃들어 있다."	},
        {	"이름" : "경죽무",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 5,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "70",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "대나무를 엮어서 만든 가볍고 단단한 허리띠."	},
        {	"이름" : "고과론",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 25,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격책략강화",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "유소가 상벌을 정의한 서적."	},
        {	"이름" : "공명심서",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 15,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "보급계책략강화",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 쓴 서적."	},
        {	"이름" : "금강령",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 10,	"방어력" : 5,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "MP회복",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "지혜를 의미하는 밀교의 도구. 금강저와 함께 사용된다."	},
        {	"이름" : "도덕론",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 15,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "지계책략강화",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "하안이 쓴 서적."	},
        {	"이름" : "박하",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 10,	"정신력" : 5,	"방어력" : 10,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "분노축적",	"특수효과수치" : "8",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "박하 나무의 잎."	},
        {	"이름" : "사령문경",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 20,	"사기" : 5,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청룡, 백호, 주작, 현무의 네 가지 신령한 동물을 새겨넣은 구리거울."	},
        {	"이름" : "상아영롱대",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 5,	"정신력" : 0,	"방어력" : 5,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "기마공격강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "상아를 끈으로 엮어 만든 허리띠."	},
        {	"이름" : "수서구장",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 15,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "화계책략강화",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "진구소가 쓴 공배수 연산 공식 산학서적."	},
        {	"이름" : "오환마",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 10,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 5,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "오환지방의 말로 매우 빠르다."	},
        {	"이름" : "옥룡",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 15,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "물리공격강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "손권 소유의 말. 비췻빛을 띤 특이한 색의 명마."	},
        {	"이름" : "용뇌향",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 15,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "용뇌 나무에서 채취한 무색투명한 향료."	},
        {	"이름" : "용자경",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 5,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "선인 등 신선사상의 문양이 새겨진 구리거울."	},
        {	"이름" : "우인수문경",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 5,	"방어력" : 0,	"순발력" : 15,	"사기" : 5,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "전설 속의 인물이나 동물 등을 새겨넣은 구리거울. 역동적인 조형이 특징이다."	},
        {	"이름" : "장군대",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 5,	"정신력" : 0,	"방어력" : 0,	"순발력" : 15,	"사기" : 5,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "70",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "장군들이 착용하던 전투용 허리띠."	},
        {	"이름" : "정상차",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 10,	"정신력" : 0,	"방어력" : 5,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "말이 끌거나 사람이 밀어서 장애물로 사용한 수레."	},
        {	"이름" : "집고산경",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 15,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "수계책략강화",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나. 왕효통이 저술했다."	},
        {	"이름" : "천리정완마",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 5,	"정신력" : 5,	"방어력" : 5,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "이동력보조",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "왕쌍 소유의 말. 하루 천 리를 달리고 다음 날도 천 리를 달리는 명마."	},
        {	"이름" : "천일루",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 20,	"사기" : 5,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "70",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "천 가지 색의 실을 엮어 만든 허리띠. 가후가 애용했다."	},
        {	"이름" : "춘란",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 5,	"정신력" : 5,	"방어력" : 5,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "도구범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "원소가 전투에서 애용하던 명마."	},
        {	"이름" : "하후양산경",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 15,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "풍계책략강화",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나."	},
        {	"이름" : "혼여경",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 15,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "방해계책략강화",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "환위이 쓴 서적."	},
        {	"이름" : "황람",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 20,	"방어력" : 0,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "원소책략강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "유이가 쓴 서적."	},
        {	"이름" : "흉노마",	"등급" : "5",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 10,	"순발력" : 5,	"사기" : 10,	"이동력" : 0,	"특수효과" : "험로이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "흉노지방의 말로 험로에 강하고 이동력이 좋다."	},
        {	"이름" : "벽온선",	"등급" : "5",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 81,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 전염병을 쫓는 부채. 모든 상태이상과 질병을 치료하는 효과가 있다."	},
        {	"이름" : "송선",	"등급" : "5",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 86,	"방어력" : 0,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 보통 부채보다 특별히 잘 만든 부채인 별선에 속한다. 부드러운 솔가지를 엮어 만든다."	},
        {	"이름" : "진주선",	"등급" : "5",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 86,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 8개의 진주가 박혀있는 고가의 부채로 궁중 혼례 때 사용되었다."	},
        {	"이름" : "팔덕선",	"등급" : "5",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 90,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 여덟 가지 덕을 지닌 부채. 주로 농촌에서 사용하던 것으로, 부채의 용도가 여덟 가지나 된다고 해 이런 이름이 붙었다."	},
        {	"이름" : "대화어아금의",	"등급" : "5",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 63,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "염색된 각색 실로 큰 무늬를 넣어 만든 비단옷."	},
        {	"이름" : "조하금의",	"등급" : "5",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 60,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "붉은색을 바탕으로 하는 평직의 염직물을 사용한 비단옷."	},
        {	"이름" : "쾌자",	"등급" : "5",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 57,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "군복의 하나로 왕 이하 서민 등이 겉옷 위에 덧입는 옷."	},
        {	"이름" : "하금의",	"등급" : "5",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 60,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "일정한 무늬를 넣어 짠 비단옷."	},
        {	"이름" : "겁번",	"등급" : "5",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 69,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "서북의 신강 지역의 옷. 면포나 낙타 털로 만든다. 챠판이라고도 한다."	},
        {	"이름" : "낭구",	"등급" : "5",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "늑대 가죽으로 만든 전포."	},
        {	"이름" : "백습군",	"등급" : "5",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 72,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "서북 지역의 의상으로 귀족 부인들이 애용하였다."	},
        {	"이름" : "악피 전포",	"등급" : "5",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 69,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "악어 가죽으로 만든 전포."	},
        {	"이름" : "우피 전포",	"등급" : "5",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 65,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "소 가죽으로 만든 전포."	},
        {	"이름" : "운하금의",	"등급" : "5",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 65,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "구름무늬를 넣어 짠 의상."	},
        {	"이름" : "웅구",	"등급" : "5",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 65,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "곰 가죽으로 만든 전포."	},
        {	"이름" : "임로",	"등급" : "5",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 69,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "서역의 여인이 시집올 때 입던 상의. 파란색과 심홍색으로 선명하게 짠 것."	},
        {	"이름" : "표구",	"등급" : "5",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 69,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "표범 가죽으로 만든 전포."	},
        {	"이름" : "구겸도",	"등급" : "5",	"종류" : "무기",	"종류2" : "창",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "장료가 애용했다고 전해지는 끝이 갈라진 창"	},
        {	"이름" : "삼첨양인도",	"등급" : "5",	"종류" : "무기",	"종류2" : "창",	"공격력" : 89,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "기령의 별명으로 불리우던 끝이 갈라진 창."	},
        {	"이름" : "수마선장",	"등급" : "5",	"종류" : "무기",	"종류2" : "창",	"공격력" : 89,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 10,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "무게가 약 62근인 노지심이 사용했다고 알려진 창."	},
        {	"이름" : "양지극",	"등급" : "5",	"종류" : "무기",	"종류2" : "창",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "감영이 사용한 창. 가벼워 신속히 움직일 수 있다."	},
        {	"이름" : "용기첨",	"등급" : "5",	"종류" : "무기",	"종류2" : "창",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "마초의 용기가 깃들어 있다고 전해지는 창."	},
        {	"이름" : "용조삭",	"등급" : "5",	"종류" : "무기",	"종류2" : "창",	"공격력" : 85,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 10,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "용의 발톱 모양을 한 창. 사용하는 장수의 공격력을 극대화 시켜준다고 한다."	},
        {	"이름" : "자오열화창",	"등급" : "5",	"종류" : "무기",	"종류2" : "창",	"공격력" : 89,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "마초가 장비와 단기접전을 벌일 때 사용했던 창"	},
        {	"이름" : "철등사모",	"등급" : "5",	"종류" : "무기",	"종류2" : "창",	"공격력" : 85,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정보가 애용한 창. 뱀처럼 창끝이 굽어 있다."	},
        {	"이름" : "독각선풍포",	"등급" : "5",	"종류" : "무기",	"종류2" : "포",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 5,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "네 개의 기둥으로 포를 지면에 고정하고 충천주를 회전할 수 있게 만든 포. 선풍포보다 안정적으로 운용이 가능한 개량판이다."	},
        {	"이름" : "선풍포",	"등급" : "5",	"종류" : "무기",	"종류2" : "포",	"공격력" : 95,	"정신력" : 0,	"방어력" : 0,	"순발력" : 5,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "기둥이 회전하는 석탄포. 줄을 당겨서 돌을 날린다. 수십 발의 석탄을 한 번에 발사할 수 있다."	},
        {	"이름" : "십삼초포",	"등급" : "5",	"종류" : "무기",	"종류2" : "포",	"공격력" : 99,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "여러 발의 무거운 포탄을 발사할 수 있는 최강의 포."	},
        {	"이름" : "경번갑",	"등급" : "4",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 54,	"순발력" : 0,	"사기" : 8,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "쇠미늘과 쇠고리를 연결하여 만든 갑옷. 연결 부위가 견고하다."	},
        {	"이름" : "금휴개",	"등급" : "4",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 54,	"순발력" : 8,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "금빛 나는 칠을 한 갑옷. 아름답게 빛나지만 실용성은 떨어진다."	},
        {	"이름" : "쇄자갑",	"등급" : "4",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 57,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "엄안의 갑옷. 철사로 만든 작은 원형의 고리를 서로 꿰어 만든다."	},
        {	"이름" : "양당식찰갑주",	"등급" : "4",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 57,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "소찰을 연결하여 좌우 옆구리에서 여미는 찰갑."	},
        {	"이름" : "지국천갑",	"등급" : "4",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 54,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불교의 사천왕 중 동방을 맡은 지국천왕의 갑옷. 신비한 힘이 깃들어 있다."	},
        {	"이름" : "통수개",	"등급" : "4",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 60,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 발명한 것이라고 전해지는 갑옷. 특별한 능력이 깃들어 있다."	},
        {	"이름" : "거치도",	"등급" : "4",	"종류" : "무기",	"종류2" : "검",	"공격력" : 57,	"정신력" : 4,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "위나라 대장군 하후돈이 애용하던 톱날처럼 들쭉날쭉한 날이 달린 곡도. 여포 토벌 당시 고순과의 싸움에서 사용했다고 전해진다."	},
        {	"이름" : "대치도",	"등급" : "4",	"종류" : "무기",	"종류2" : "검",	"공격력" : 60,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황충 소유의 도. 날 끝이 무디게 생긴 것이 특징이다."	},
        {	"이름" : "백피도",	"등급" : "4",	"종류" : "무기",	"종류2" : "검",	"공격력" : 54,	"정신력" : 4,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조조가 3년을 소비해 만들게 한 5겹의 직도. 오파보도, 백련이라고도 불린다."	},
        {	"이름" : "신도",	"등급" : "4",	"종류" : "무기",	"종류2" : "검",	"공격력" : 57,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 포원에게 제작을 명한 직도로, 예리하기가 당대 최고였다고 한다."	},
        {	"이름" : "육선검",	"등급" : "4",	"종류" : "무기",	"종류2" : "검",	"공격력" : 54,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신선을 죽이는 무기인 사선검의 하나."	},
        {	"이름" : "주선검",	"등급" : "4",	"종류" : "무기",	"종류2" : "검",	"공격력" : 54,	"정신력" : 4,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신선을 죽이는 무기인 사선검의 하나."	},
        {	"이름" : "호접쌍도",	"등급" : "4",	"종류" : "무기",	"종류2" : "검",	"공격력" : 57,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "길이가 짧지만 두꺼운 날을 가진 2개의 단도. 나비의 날개 모양처럼 생긴 오구의 일종이다."	},
        {	"이름" : "구절편",	"등급" : "4",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 51,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황개가 사용한 편. 9개의 쇠뭉치가 연결되어 있다."	},
        {	"이름" : "철쇄",	"등급" : "4",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 51,	"정신력" : 4,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "감녕이 애용했다고 전해지는 철구를 붙인 쇠사슬. 휘두르면 독특한 소리가 난다."	},
        {	"이름" : "철추",	"등급" : "4",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 54,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철로 된 추를 달아 휘두르는 무기. 무안국이 사용했다."	},
        {	"이름" : "팔각봉",	"등급" : "4",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 49,	"정신력" : 4,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "마초가 애용한 봉으로 장비와의 단기접전에서 사용한 것으로 유명하다."	},
        {	"이름" : "건곤궁",	"등급" : "4",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 54,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "한현의 부하였던 황충이 관우와 싸울 때 사용한 활. 명중률이 우수하다."	},
        {	"이름" : "보조궁",	"등급" : "4",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 51,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "헌제가 사냥 시 사용한 활. 알려진 능력은 없다."	},
        {	"이름" : "궐장노",	"등급" : "4",	"종류" : "무기",	"종류2" : "노",	"공격력" : 57,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "앉아서 발로 장전하는 강력한 휴대용 노. 연사가 안 되는 대신 한 발의 공격력이 크다."	},
        {	"이름" : "극적노",	"등급" : "4",	"종류" : "무기",	"종류2" : "노",	"공격력" : 60,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신경노를 개조하여 공격력을 강화한 노. 연사가 어렵다."	},
        {	"이름" : "천보노",	"등급" : "4",	"종류" : "무기",	"종류2" : "노",	"공격력" : 57,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "고정 설치 후 사용하는 대형 노로 강한 공격력을 자랑한다."	},
        {	"이름" : "백호보도",	"등급" : "4",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 51,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "백호의 힘이 깃든 보도."	},
        {	"이름" : "상방보검",	"등급" : "4",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 49,	"방어력" : 0,	"순발력" : 8,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "육손이 사용했으며 무소불위의 권력을 상징하는 검이다. 장수가 황제에게 하사받으면 막강한 권한을 행사할 수 있다."	},
        {	"이름" : "주작보도",	"등급" : "4",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 54,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주작의 힘이 깃든 보도."	},
        {	"이름" : "청룡보도",	"등급" : "4",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 51,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청룡의 힘이 깃든 보도."	},
        {	"이름" : "현무보도",	"등급" : "4",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 49,	"방어력" : 0,	"순발력" : 0,	"사기" : 8,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "현무의 힘이 깃든 보도."	},
        {	"이름" : "고사고",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 12,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "방해계책략강화",	"특수효과수치" : "12",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "초주가 쓴 서적."	},
        {	"이름" : "근하유양법",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 12,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "화계책략강화",	"특수효과수치" : "12",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "단위 환산 계산서"	},
        {	"이름" : "금경",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 16,	"사기" : 4,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "금으로 만들어진 거울."	},
        {	"이름" : "마차",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 8,	"정신력" : 0,	"방어력" : 4,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "말에 의한 다수 운송 수단."	},
        {	"이름" : "밀 주머니",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 4,	"방어력" : 4,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "소모품자동사용",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "일정량의 체력을 잃을 때마다 [회복의 밀]을 사용한다. 도구가 없을 때는 아무 효과도 발생하지 않는다."	},
        {	"이름" : "백단향낭",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 8,	"정신력" : 4,	"방어력" : 8,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "분노축적",	"특수효과수치" : "6",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "최고의 향으로 취급되는 백단 향나무로 만든 향 주머니."	},
        {	"이름" : "법훈",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 12,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "지계책략강화",	"특수효과수치" : "12",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "초주가 쓴 서적."	},
        {	"이름" : "보리 주머니",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 4,	"방어력" : 4,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "소모품자동사용",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "일정량의 체력을 잃을 때마다 [회복의 보리]를 사용한다. 도구가 없을 때는 아무 효과도 발생하지 않는다."	},
        {	"이름" : "소열유혈",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 16,	"사기" : 4,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "50",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "유비가 감부인에게 하사한 허리띠. 신비로운 문양이 새겨져 있다."	},
        {	"이름" : "신수경",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 4,	"방어력" : 0,	"순발력" : 12,	"사기" : 4,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신수가 새겨진 거울."	},
        {	"이름" : "오조산경",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 12,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "풍계책략강화",	"특수효과수치" : "12",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나."	},
        {	"이름" : "오화마",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 8,	"정신력" : 0,	"방어력" : 0,	"순발력" : 8,	"사기" : 4,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "손책 소유의 말. 푸른색과 백색의 조화로 다섯 가지 빛깔의 털을 가진 아름다운 말."	},
        {	"이름" : "웅대",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 0,	"방어력" : 4,	"순발력" : 8,	"사기" : 8,	"이동력" : 0,	"특수효과" : "기마공격강화",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "곰의 가죽으로 만든 허리띠. 공손강이 사용했다."	},
        {	"이름" : "웅삭대",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 0,	"방어력" : 0,	"순발력" : 8,	"사기" : 8,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "50",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "삭을 꽂을 수 있는 무기집이 달려 있는 허리띠. 활동이 용이하다."	},
        {	"이름" : "의남백마",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 8,	"순발력" : 4,	"사기" : 8,	"이동력" : 0,	"특수효과" : "험로이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "다리가 검은 백마로 공손찬이 소유했다."	},
        {	"이름" : "익부기구전",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 16,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "원소책략강화",	"특수효과수치" : "8",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "이선이 쓴 서적."	},
        {	"이름" : "인물지",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 20,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격책략강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "유이가 쓴 서적."	},
        {	"이름" : "자류구",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 12,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "물리공격강화",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "자색 빛의 전투용 명마."	},
        {	"이름" : "자류마",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 4,	"방어력" : 4,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "도구범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "자줏빛의 갈기가 인상적인 안량 소유의 명마."	},
        {	"이름" : "장구건산경",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 12,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "수계책략강화",	"특수효과수치" : "12",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나."	},
        {	"이름" : "전투 팔입대",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 0,	"방어력" : 0,	"순발력" : 12,	"사기" : 4,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "50",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "작은 무기와 암기 등을 수납할 수 있는 허리띠. 감녕이 사용했다."	},
        {	"이름" : "조 주머니",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 4,	"방어력" : 4,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "소모품자동사용",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "일정량의 체력을 잃을 때마다 [회복의 조]를 사용한다. 도구가 없을 때는 아무 효과도 발생하지 않는다."	},
        {	"이름" : "춘추삼전",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 12,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "보급계책략강화",	"특수효과수치" : "12",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "손숙연이 쓴 서적."	},
        {	"이름" : "취화류마",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 4,	"방어력" : 4,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "이동력보조",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "서황 애용했던 갈색의 명마."	},
        {	"이름" : "향라수건",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 8,	"방어력" : 4,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "MP회복",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "초선이 지니고 있던 비단 수건. 초선이 왕윤의 연회에서 춤을 출 때 사용하였다고 한다."	},
        {	"이름" : "향유",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 12,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "다양한 용도로 사용하는 향이 배어있는 기름."	},
        {	"이름" : "화상경",	"등급" : "4",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 4,	"방어력" : 0,	"순발력" : 8,	"사기" : 8,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "고대에 만들어 쓰던 구리재질 거울로 화상 무늬가 장식되어 있다."	},
        {	"이름" : "대원선",	"등급" : "4",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 57,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 원에 손잡이가 달린 형태의 부채이다."	},
        {	"이름" : "미선",	"등급" : "4",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 57,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 어류의 꼬리를 본떠 만들었다."	},
        {	"이름" : "세미선",	"등급" : "4",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 54,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 조류의 꼬리를 본떠 만들었다."	},
        {	"이름" : "태극선",	"등급" : "4",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 60,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 여자가 사용하는 8각형 또는 원형의 부채. 중앙에는 태극이 장식되어 있다."	},
        {	"이름" : "공단의",	"등급" : "4",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 42,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "비단 소재의 의복."	},
        {	"이름" : "명주의",	"등급" : "4",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 40,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "명주실을 꼬아 만든 의복."	},
        {	"이름" : "소화어아금의",	"등급" : "4",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 38,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "염색된 각색 실로 작은 무늬를 넣어 만든 비단옷."	},
        {	"이름" : "수의",	"등급" : "4",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 40,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "옷감 위에 갖가지 빛깔로 수놓은 비단 옷"	},
        {	"이름" : "낙모의",	"등급" : "4",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 46,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "낙타 털로 만든 옷. 서역에서 실크로드를 통해 전해졌다."	},
        {	"이름" : "백금의",	"등급" : "4",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 48,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "일정한 무늬를 넣어 짠 비단 의상."	},
        {	"이름" : "양구",	"등급" : "4",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 43,	"순발력" : 0,	"사기" : 8,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "양 가죽으로 만든 전포. 북방 유목민이 애용했다."	},
        {	"이름" : "영괘",	"등급" : "4",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 46,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "남방 지역에서 통용된 의상."	},
        {	"이름" : "적모계",	"등급" : "4",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 46,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "동물 털로 짠 모직물로 만든 전포. 붉은색이 두드러지며 보온성과 방한성이 우수하다."	},
        {	"이름" : "청삼",	"등급" : "4",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 48,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "벼슬을 한 관리들이 주로 입던 청색의 조복."	},
        {	"이름" : "치파오",	"등급" : "4",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 46,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "북부 지역에서 통용된 의상."	},
        {	"이름" : "호백구",	"등급" : "4",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 43,	"순발력" : 8,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "여우 옆구리의 하얀 털로 만든 귀한 가죽 전포."	},
        {	"이름" : "황마의",	"등급" : "4",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 43,	"순발력" : 8,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황색의 마로 만든 의상으로 안동포라고도 불린다."	},
        {	"이름" : "곤룡도",	"등급" : "4",	"종류" : "무기",	"종류2" : "창",	"공격력" : 59,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "황충이 다루던 창. 하후연과의 대결에서 사용했다고 전해진다."	},
        {	"이름" : "낙도부",	"등급" : "4",	"종류" : "무기",	"종류2" : "창",	"공격력" : 56,	"정신력" : 0,	"방어력" : 0,	"순발력" : 8,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "기병들을 떨어트린다는 도끼."	},
        {	"이름" : "낭아봉",	"등급" : "4",	"종류" : "무기",	"종류2" : "창",	"공격력" : 63,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창끝에 여러 개의 철침이 박혀있는 무기"	},
        {	"이름" : "방천극",	"등급" : "4",	"종류" : "무기",	"종류2" : "창",	"공격력" : 63,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창날의 양쪽에다 월아를 단 창. 가화, 송겸, 악환, 한기, 한경 등이 애용했다."	},
        {	"이름" : "백염부",	"등급" : "4",	"종류" : "무기",	"종류2" : "창",	"공격력" : 59,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 8,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "위나라 명장 서황이 휘둘렀던 거대한 도끼."	},
        {	"이름" : "삼두창",	"등급" : "4",	"종류" : "무기",	"종류2" : "창",	"공격력" : 59,	"정신력" : 0,	"방어력" : 0,	"순발력" : 8,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창 끝이 세 갈래로 갈라진 형태의 무기."	},
        {	"이름" : "울림극",	"등급" : "4",	"종류" : "무기",	"종류2" : "창",	"공격력" : 66,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가동이 애용한 극으로 휘두를 때 소리가 난다고 한다."	},
        {	"이름" : "해신창",	"등급" : "4",	"종류" : "무기",	"종류2" : "창",	"공격력" : 56,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 8,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "세 갈래로 갈라진 거대한 창. 주로 해안 지방에서 바다 신에게 제사를 지낼 때 사용하였다."	},
        {	"이름" : "쌍초포",	"등급" : "4",	"종류" : "무기",	"종류2" : "포",	"공격력" : 66,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "적당한 무게의 탄을 멀리 발사할 수 있는 포"	},
        {	"이름" : "오초포",	"등급" : "4",	"종류" : "무기",	"종류2" : "포",	"공격력" : 63,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "무거운 탄을 발사할 수 있는 개량포."	},
        {	"이름" : "칠초포",	"등급" : "4",	"종류" : "무기",	"종류2" : "포",	"공격력" : 59,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "매우 무거운 탄을 발사할 수 있는 대형 포."	},
        {	"이름" : "호준포",	"등급" : "4",	"종류" : "무기",	"종류2" : "포",	"공격력" : 63,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "척계광이 발명한 포이며, 호랑이가 웅크리고 앉아 있는 것과 닮았다."	},
        {	"이름" : "동경갑",	"등급" : "3",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 36,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철찰과 철환을 서로 사이에 두고 철한 갑옷. 우수한 방어력을 갖고 있다."	},
        {	"이름" : "두두미갑",	"등급" : "3",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 38,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "방호의 역할은 약한 일종의 의장용 갑옷. 상징성이 강하다."	},
        {	"이름" : "삼각판갑",	"등급" : "3",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 38,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "횡장판, 장방판갑으로 지판과 대금을 사용하는 실용적인 판갑. 형태가 특이하다."	},
        {	"이름" : "장방판갑",	"등급" : "3",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 36,	"순발력" : 6,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "삼각판갑과 마찬가지로 대금 사이의 지판 구성이 장방형으로 이루어진 갑옷. 튼튼하다."	},
        {	"이름" : "증후을피갑",	"등급" : "3",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 40,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "피갑주의 일종. 생저피로 찰을 하고 연록비로 엮은 것으로 방어 범위가 넓은 개갑이다."	},
        {	"이름" : "횡장판갑",	"등급" : "3",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 36,	"순발력" : 0,	"사기" : 6,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "삼각판갑이 여러 매의 삼각판을 이용하던 것을 세장방형 철판을 인체의 곡률에 맞게 구부려 횡으로 댄 갑옷. 체형에 딱 맞아 편하게 입을 수 있다."	},
        {	"이름" : "경검",	"등급" : "3",	"종류" : "무기",	"종류2" : "검",	"공격력" : 40,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "여포 휘하의 맹장 고순이 사용했던 검. 깃털처럼 가벼워 다루기가 쉽다고 한다."	},
        {	"이름" : "금배감산도",	"등급" : "3",	"종류" : "무기",	"종류2" : "검",	"공격력" : 38,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "문추가 애용한 검. 75근이나 되는 창과 같은 검이다."	},
        {	"이름" : "삼정합산판문도",	"등급" : "3",	"종류" : "무기",	"종류2" : "검",	"공격력" : 38,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "안량이 애용한 검. 이름의 거창함과는 달리 그 능력은 평범하다."	},
        {	"이름" : "숭문양보검",	"등급" : "3",	"종류" : "무기",	"종류2" : "검",	"공격력" : 36,	"정신력" : 3,	"방어력" : 0,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "남만왕 맹획이 애용한 검."	},
        {	"이름" : "용아도",	"등급" : "3",	"종류" : "무기",	"종류2" : "검",	"공격력" : 38,	"정신력" : 3,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "촉한의 명장 위연이 사용했다고 전해지는 도. 어룡도라고도 불린다."	},
        {	"이름" : "유엽도",	"등급" : "3",	"종류" : "무기",	"종류2" : "검",	"공격력" : 36,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "오구의 일종. 검신의 형태가 버드나무 잎을 닮았다 하여 이런 이름이 되었다. 오나라에서 주로 사용되었다."	},
        {	"이름" : "초수도",	"등급" : "3",	"종류" : "무기",	"종류2" : "검",	"공격력" : 36,	"정신력" : 3,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "마등이 애용한 도. 환도의 일종으로 두꺼운 검신이 특징이다."	},
        {	"이름" : "강철편",	"등급" : "3",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 36,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "문앙이 사용한 강철로 만들어진 채찍. 상처가 크게 벌어진다."	},
        {	"이름" : "금편",	"등급" : "3",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 34,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사슬로 이어진 여러 마디의 편곤. 장거리의 적을 다양한 방향으로 공격할 수 있다."	},
        {	"이름" : "쌍절곤",	"등급" : "3",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 32,	"정신력" : 3,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "2개의 편이 사슬로 이어져 타격 공격에 쉽게 만들어진 곤."	},
        {	"이름" : "철연",	"등급" : "3",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 34,	"정신력" : 3,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "감녕이 사용한 철퇴. 가볍지만 단단하여 위력적이다."	},
        {	"이름" : "다현궁",	"등급" : "3",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 34,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "복수의 현으로 강화된 활. 더욱 센 공격이 가능하다."	},
        {	"이름" : "쇠반궁",	"등급" : "3",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 36,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "문추가 애용한 무쇠로 만든 활. 무겁고 튼튼하며 잘 부서지지 않는다."	},
        {	"이름" : "고차노",	"등급" : "3",	"종류" : "무기",	"종류2" : "노",	"공격력" : 38,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도르래를 달아 더욱 위력을 발휘하는 노. 도르래 감기에 따라 명중률과 공격력이 변한다."	},
        {	"이름" : "등자노",	"등급" : "3",	"종류" : "무기",	"종류2" : "노",	"공격력" : 40,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "궐장노의 원형. 활채의 앞쪽에 등자가 있어 한 발로 장전이 가능하다."	},
        {	"이름" : "신경노",	"등급" : "3",	"종류" : "무기",	"종류2" : "노",	"공격력" : 38,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "신비노를 개조하여 공격력을 강화한 노. 경도를 위해 무게를 포기했다."	},
        {	"이름" : "소련",	"등급" : "3",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 32,	"방어력" : 0,	"순발력" : 0,	"사기" : 6,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "은나라의 3대 보검. 형체가 없어 낮에는 그림자, 밤에는 광채만 보인다고 한다. 베인 사람이 고통을 느끼지만 상처를 입지는 않는다고 한다."	},
        {	"이름" : "승영",	"등급" : "3",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 34,	"방어력" : 0,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "은나라의 3대 보검. 그림자만 보이고 광채가 없으며, 베인 사람이 고통을 느끼지 못한다고 한다."	},
        {	"이름" : "연혼검",	"등급" : "3",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 36,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주술의 힘이 깃들어 있는 보검으로 여인의 혼이 잠들어 있다고 한다."	},
        {	"이름" : "초치검",	"등급" : "3",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 32,	"방어력" : 0,	"순발력" : 6,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "초고왕의 검으로 풀을 후려쳐 벤 칼이라는 뜻이며 천총운검으로도 불리는 보검."	},
        {	"이름" : "함광",	"등급" : "3",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 34,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "은나라의 3대 보검. 광채를 숨기고 있어 휘둘러도 보이지 않고, 물건을 베어도 감각을 느끼지 못한다고 한다."	},
        {	"이름" : "결리",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 3,	"정신력" : 0,	"방어력" : 0,	"순발력" : 9,	"사기" : 3,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "구멍이 뚫려있는 황색의 허리띠. 공도가 사용했다."	},
        {	"이름" : "기장 주머니",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 3,	"정신력" : 3,	"방어력" : 3,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "소모품자동사용",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "일정량의 체력을 잃을 때마다 [회복의 기장]을 사용한다. 도구가 없을 때는 아무 효과도 발생하지 않는다."	},
        {	"이름" : "모시정전",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 9,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "화계책략강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정현이 쓴 서적."	},
        {	"이름" : "백상",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 6,	"순발력" : 3,	"사기" : 6,	"이동력" : 0,	"특수효과" : "험로이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "목록대왕의 말. 힘이 좋다."	},
        {	"이름" : "백용마",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 6,	"정신력" : 0,	"방어력" : 0,	"순발력" : 6,	"사기" : 3,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "마초가 사용했던 말로 흰 털에 검은 갈기가 인상적인 명마."	},
        {	"이름" : "삼례해고",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 9,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "풍계책략강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "노식이 쓴 서적."	},
        {	"이름" : "손자산경",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 9,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "보급계책략강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나."	},
        {	"이름" : "수대문감",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 3,	"방어력" : 0,	"순발력" : 6,	"사기" : 6,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "짐승 문양이 새겨진 물거울. 청동 거울 이전에 사용되었다고 한다."	},
        {	"이름" : "신수벼루",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 9,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도금된 청동제 벼루. 신수 모양을 하고 있으며 보석이 박혀있다."	},
        {	"이름" : "쌀 주머니",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 3,	"정신력" : 3,	"방어력" : 3,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "소모품자동사용",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "일정량의 체력을 잃을 때마다 [회복의 쌀]을 사용한다. 도구가 없을 때는 아무 효과도 발생하지 않는다."	},
        {	"이름" : "영롱대",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 3,	"정신력" : 0,	"방어력" : 3,	"순발력" : 6,	"사기" : 6,	"이동력" : 0,	"특수효과" : "기마공격강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "끈을 엮어 만든 허리띠. 다양한 색실이 사용되어 고급스럽다."	},
        {	"이름" : "오서",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 12,	"방어력" : 0,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "원소책략강화",	"특수효과수치" : "6",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주소, 위요, 설영, 화핵이 쓴 서적."	},
        {	"이름" : "오종도술",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 15,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격책략강화",	"특수효과수치" : "4",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "설종이 쓴 서적."	},
        {	"이름" : "옥추마",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "물리공격강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "장비 소유의 말. 표월오라고도 불린다. 검은 갈기에 검푸른 털을 가진 흑마."	},
        {	"이름" : "은경",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 3,	"방어력" : 0,	"순발력" : 9,	"사기" : 3,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "은으로 만든 거울."	},
        {	"이름" : "이추",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 6,	"방어력" : 3,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "MP회복",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "여성들이 진귀한 장식으로 치장한 귀걸이."	},
        {	"이름" : "인력거",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 6,	"정신력" : 0,	"방어력" : 3,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사람이 사람을 태우고 다니는 운송수단."	},
        {	"이름" : "자단향낭",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 6,	"정신력" : 3,	"방어력" : 6,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "분노축적",	"특수효과수치" : "4",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "붉은색 자단 향나무로 만든 향 주머니."	},
        {	"이름" : "잠룡시첩",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 9,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "지계책략강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가충이 쓴 서적."	},
        {	"이름" : "정화대",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 12,	"사기" : 3,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "꽃물을 칠한 천으로 만든 허리띠. 감부인이 사용했다."	},
        {	"이름" : "지군자감",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 12,	"사기" : 3,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "15",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "춘추시대 진나라 지씨가 사용하던 물거울."	},
        {	"이름" : "패립대",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 3,	"정신력" : 0,	"방어력" : 0,	"순발력" : 6,	"사기" : 6,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "30",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "조개 껍질을 가공해 장식한 허리띠. 감녕이 사용했다."	},
        {	"이름" : "한시장구",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 9,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "수계책략강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "두경이 쓴 서적."	},
        {	"이름" : "해도산경",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 9,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "방해계책략강화",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나."	},
        {	"이름" : "화안포",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 3,	"정신력" : 3,	"방어력" : 3,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "도구범위확장",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "문추와 함께 전장을 누빈 검은 줄무늬가 있는 명마."	},
        {	"이름" : "화종마",	"등급" : "3",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 3,	"정신력" : 3,	"방어력" : 3,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "이동력보조",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "털에 붉은빛이 나는 명마로 손견이 애용했다."	},
        {	"이름" : "사선",	"등급" : "3",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 38,	"방어력" : 0,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 네 선녀를 그린 무선."	},
        {	"이름" : "삼불선",	"등급" : "3",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 38,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "둥글부채의 일종. 세 부처를 그린 무선."	},
        {	"이름" : "소선",	"등급" : "3",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 36,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "그림이나 글씨가 없는 부채. 국상이나 친상을 당했을 때 지니고 다니는 용도로 파마의 힘을 갖고 있다."	},
        {	"이름" : "일월선",	"등급" : "3",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 40,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "접부채의 일종. 선면에 해와 달이 그려진 무선."	},
        {	"이름" : "가사",	"등급" : "3",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 27,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "괴색, 부정색, 탁색, 탁염색, 염색과 같은 뜻을 지닌 불교의 의상."	},
        {	"이름" : "승복",	"등급" : "3",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 28,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "스님들의 일상 의복. 정신을 집중시키는 효과가 있다."	},
        {	"이름" : "양단의",	"등급" : "3",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 25,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "누에고치에서 뽑은 길고 매끄러운 실로 짠 천으로 만든 의복."	},
        {	"이름" : "편삼",	"등급" : "3",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 27,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "법의의 일종. 혜광 대사가 만들었다고 한다. 도포와 유사한 모양이다."	},
        {	"이름" : "뤄바족복",	"등급" : "3",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 29,	"순발력" : 6,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "뤄바족의 전통 의상."	},
        {	"이름" : "리족의",	"등급" : "3",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 30,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "리족의 전통 의상."	},
        {	"이름" : "사라족복",	"등급" : "3",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 27,	"순발력" : 3,	"사기" : 6,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사라족의 전통 의상."	},
        {	"이름" : "여족의",	"등급" : "3",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 32,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "서족의 전통 의상."	},
        {	"이름" : "위구르족복",	"등급" : "3",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 27,	"순발력" : 6,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "위구르족의 전통 의상."	},
        {	"이름" : "위구족복",	"등급" : "3",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 29,	"순발력" : 0,	"사기" : 6,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "위구족의 전통 의상."	},
        {	"이름" : "장족의",	"등급" : "3",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 30,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "티베트의 전통 의상."	},
        {	"이름" : "카자흐족복",	"등급" : "3",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 32,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "카자흐족의 전통 의상."	},
        {	"이름" : "투족복",	"등급" : "3",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 29,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "투족의 전통 의상."	},
        {	"이름" : "구겸창",	"등급" : "3",	"종류" : "무기",	"종류2" : "창",	"공격력" : 40,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 6,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창날에 창을 쥔 사람 쪽을 향한 구를 붙여놓은 창으로 안쪽으로 휘어진 구로 적을 때리거나 넘어뜨릴 수 있다."	},
        {	"이름" : "당파",	"등급" : "3",	"종류" : "무기",	"종류2" : "창",	"공격력" : 42,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "갈퀴 형태의 장무기."	},
        {	"이름" : "미첨도",	"등급" : "3",	"종류" : "무기",	"종류2" : "창",	"공격력" : 44,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사람의 눈썹처럼 생긴 곡선을 이루고 있는 날이 인상적인 창."	},
        {	"이름" : "삼장모",	"등급" : "3",	"종류" : "무기",	"종류2" : "창",	"공격력" : 42,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "삼척 길이의 보병용 장창. 여러 병사가 함께 들고 사용한다."	},
        {	"이름" : "웅삭",	"등급" : "3",	"종류" : "무기",	"종류2" : "창",	"공격력" : 40,	"정신력" : 0,	"방어력" : 0,	"순발력" : 6,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "공도와 공손강이 애용한 기병용 창. 곰도 잡는 창이라는 의미가 있다."	},
        {	"이름" : "월아산",	"등급" : "3",	"종류" : "무기",	"종류2" : "창",	"공격력" : 40,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "월아선장이라고도 불린다. 월아가 달린 창으로 찌르기와 베기, 모두 큰 피해를 줄 수 있다."	},
        {	"이름" : "조도부",	"등급" : "3",	"종류" : "무기",	"종류2" : "창",	"공격력" : 37,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 6,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "도를 대신해서 사용한 도끼 모양의 병기."	},
        {	"이름" : "홍영창",	"등급" : "3",	"종류" : "무기",	"종류2" : "창",	"공격력" : 37,	"정신력" : 0,	"방어력" : 0,	"순발력" : 6,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "붉은 술이 달린 창. 매우 가벼워 창 놀림이 붉은 그림자 같다고 하여 이런 이름이 붙었다."	},
        {	"이름" : "단초포",	"등급" : "3",	"종류" : "무기",	"종류2" : "포",	"공격력" : 42,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 3,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가벼운 탄을 중거리에 발사할 수 있는 포"	},
        {	"이름" : "수포",	"등급" : "3",	"종류" : "무기",	"종류2" : "포",	"공격력" : 44,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "인력과 지레의 원리를 이용하여 석탄을 발사하는 병기다. 45~125명의 병사에 의해 발사된다."	},
        {	"이름" : "합포",	"등급" : "3",	"종류" : "무기",	"종류2" : "포",	"공격력" : 42,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "수포보다 강화되어 더욱 큰 위력을 발휘하는 포."	},
        {	"이름" : "복권갑",	"등급" : "2",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 23,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "갑옷을 간략화하여 배 부분만을 덮고있는 경갑. 가볍지만 화살은 막아내지 못한다."	},
        {	"이름" : "종장판갑",	"등급" : "2",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 25,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철판의 형태가 주로 종장판이다. 철판 연결방법은 가죽으로 엮은 종장판혁결판갑과 납작한 못으로 고정한 종장정결판갑이 있다."	},
        {	"이름" : "포배갑",	"등급" : "2",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 24,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "내부가 철제 미늘로 되어있는 면갑. 근접전에 유리하다."	},
        {	"이름" : "흑휴개",	"등급" : "2",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 24,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "표면에 옻을 칠하여 만든 개갑. 비가 오더라도 안심."	},
        {	"이름" : "고검",	"등급" : "2",	"종류" : "무기",	"종류2" : "검",	"공격력" : 23,	"정신력" : 2,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "고정이 애용한 검. 가문에 전해 내려오던 명검이라고 한다."	},
        {	"이름" : "묘족첨도",	"등급" : "2",	"종류" : "무기",	"종류2" : "검",	"공격력" : 24,	"정신력" : 2,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "단도의 일종. 중국 운남성의 묘족 전통 무기이다."	},
        {	"이름" : "비검",	"등급" : "2",	"종류" : "무기",	"종류2" : "검",	"공격력" : 23,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가범이 애용한 검. 제비처럼 빠르게 적을 베었다고 하여 이런 이름이 붙었다."	},
        {	"이름" : "오영도",	"등급" : "2",	"종류" : "무기",	"종류2" : "검",	"공격력" : 24,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가동이 애용한 도. 까마귀 그림자처럼 검은 도신으로 인해 이런 이름이 붙었다."	},
        {	"이름" : "웅검",	"등급" : "2",	"종류" : "무기",	"종류2" : "검",	"공격력" : 23,	"정신력" : 2,	"방어력" : 0,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "간옹이 애용한 검. 춘추 시대 오나라의 간장이 만들어 당시 왕이었던 합려에게 바쳤다는 전설이 있다."	},
        {	"이름" : "자화도",	"등급" : "2",	"종류" : "무기",	"종류2" : "검",	"공격력" : 24,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "염흥이 애용한 검. 검은빛이 나는 도검이다."	},
        {	"이름" : "절두대도",	"등급" : "2",	"종류" : "무기",	"종류2" : "검",	"공격력" : 25,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "망아장이 애용한 검. 참수하는 데 주로 이용했다."	},
        {	"이름" : "동추",	"등급" : "2",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 22,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "끝 부분이 원뿔꼴의 구리로 만들어진 자루가 긴 쇠망치. 강한 근력이 있어야 사용할 수 있다."	},
        {	"이름" : "사릉철간",	"등급" : "2",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 23,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "부첨이 애용한 무기. 철이나 청동을 소재로 만든 길이가 짧은 봉이다."	},
        {	"이름" : "톤파",	"등급" : "2",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 22,	"정신력" : 2,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "짧은 막대기 형태의 곤봉의 일종. 민첩한 공격이 가능하다."	},
        {	"이름" : "정자궁",	"등급" : "2",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 22,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "지레궁. 활 끝에 지렛대를 붙여 강화한 활. 사용하려면 근력이 많이 요구된다."	},
        {	"이름" : "활차궁",	"등급" : "2",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 23,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "활의 양 끝에 도르래를 달아 강화한 활. 특수한 기술이 필요하다."	},
        {	"이름" : "신비노",	"등급" : "2",	"종류" : "무기",	"종류2" : "노",	"공격력" : 24,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "강력한 공격력을 가진 노. 복합 소재로 제작되어 튼튼하다."	},
        {	"이름" : "연노",	"등급" : "2",	"종류" : "무기",	"종류2" : "노",	"공격력" : 25,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "연속해서 활을 발사할 수 있는 노. 다발형의 제갈노와는 달리 연사가 가능한 것이 특징이다. 연속 공격 효과가 있다."	},
        {	"이름" : "삼인검",	"등급" : "2",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 21,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사인참사검을 만드는 과정에서 함께 제작되는 검. 12년에 1번밖에 만들지 못한다. 강력한 주술적인 힘을 갖고 있다."	},
        {	"이름" : "삼정검",	"등급" : "2",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 22,	"방어력" : 0,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "삼인검과 유사하게 제작되는 보검이나 1년에 1번 만들 수 있어 좀 더 범용적으로 사용된다."	},
        {	"이름" : "삼진검",	"등급" : "2",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 21,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사진참사검을 만드는 과정에서 함께 제작되는 검. 12년에 1번밖에 만들지 못한다. 강력한 주술적인 힘을 갖고 있다."	},
        {	"이름" : "인검",	"등급" : "2",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 23,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "인월 인일 인시에 만들어내는 보검. 강력한 파마의 힘을 갖고 있다."	},
        {	"이름" : "전어도",	"등급" : "2",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 22,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "역날검처럼 생긴 금빛 의사도이다. 자루가 용머리 형태로 되어 있다."	},
        {	"이름" : "경전무진정옥대",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 2,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "다양한 글자들이 새겨진 허리띠. 간옹이 사용했다."	},
        {	"이름" : "계한보신찬",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 6,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "방해계책략강화",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "양희가 쓴 서적."	},
        {	"이름" : "과하마",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 2,	"정신력" : 2,	"방어력" : 2,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "이동력보조",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "고구려산 명마. 체구는 약간 작지만 빠르다."	},
        {	"이름" : "구장산술",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 8,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "원소책략강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나. 산학에서 구구단을 가르치는 책. 속미 쇠분 소광 등이 있다."	},
        {	"이름" : "나기향낭",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 2,	"방어력" : 4,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "분노축적",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "박쥐 등의 자수가 새겨진 고가의 향 주머니."	},
        {	"이름" : "대완마",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 2,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "대완국의 명마로 피처럼 붉은 땀을 흘리며 주인을 배신하지 않는다. 한혈마라고도 한다. 페르시아산."	},
        {	"이름" : "상서박",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 6,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "풍계책략강화",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정병이 쓴 서적."	},
        {	"이름" : "상서장구",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 6,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "지계책략강화",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "노식이 쓴 서적."	},
        {	"이름" : "수레",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 4,	"정신력" : 0,	"방어력" : 2,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "소나 말에 의해 짐을 운반하는 수레."	},
        {	"이름" : "요경전",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 6,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "수계책략강화",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "엄준이 쓴 서적."	},
        {	"이름" : "유리 거울",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 2,	"방어력" : 0,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "표면이 편평한 유리판 뒷면에 수은을 바르고, 습기를 막기 위하여 그 위에 연단을 칠해 만든다"	},
        {	"이름" : "의예주",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 6,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "화계책략강화",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "정현이 쓴 주석문."	},
        {	"이름" : "적모우",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 6,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "물리공격강화",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "맹획이 말 대신 타고 다니던 거대한 소."	},
        {	"이름" : "정문경",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 8,	"사기" : 2,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "청동 거울의 일종. 다뉴세문경이라고도 한다."	},
        {	"이름" : "주비산경",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 10,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격책략강화",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나."	},
        {	"이름" : "중대",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 2,	"정신력" : 0,	"방어력" : 2,	"순발력" : 4,	"사기" : 4,	"이동력" : 0,	"특수효과" : "기마공격강화",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "튼튼하고 무거운 허리띠. 공수가 사용했다."	},
        {	"이름" : "철경",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 2,	"방어력" : 0,	"순발력" : 6,	"사기" : 2,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "철로 만든 거울."	},
        {	"이름" : "청라산",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 4,	"방어력" : 2,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "MP회복",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "군주가 쓰던 푸른 비단 우산으로 손권이 주태에게 하사했다."	},
        {	"이름" : "팔황사채",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 6,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "보급계책략강화",	"특수효과수치" : "7",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "고옹이 쓴 서적."	},
        {	"이름" : "헌화대",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 8,	"사기" : 2,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "흰색 꽃무늬가 장식된 허리띠. 청초한 느낌을 준다."	},
        {	"이름" : "홍화대",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 2,	"정신력" : 0,	"방어력" : 0,	"순발력" : 6,	"사기" : 2,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "20",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "붉은 꽃무늬로 장식된 허리띠. 귀부인들이 주로 착용했다."	},
        {	"이름" : "화섭자",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 6,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불을 붙이는 도구."	},
        {	"이름" : "황표마",	"등급" : "2",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 4,	"순발력" : 2,	"사기" : 4,	"이동력" : 0,	"특수효과" : "험로이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "망아장 소유의 갈색의 말. 지구력이 좋다."	},
        {	"이름" : "학선",	"등급" : "2",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 25,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "선면을 날개를 편 학처럼 형상화한 학선."	},
        {	"이름" : "화입선",	"등급" : "2",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 24,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "접부채의 일종. 풍경화와 시구를 그려 넣은 부채를 의미한다."	},
        {	"이름" : "회선",	"등급" : "2",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 24,	"방어력" : 0,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "회나무 껍질 25개를 엮은 뒤 흰 종이를 바르고. 그 위에 등꽃 모양을 놓아 띠같이 만든 부채."	},
        {	"이름" : "광목의",	"등급" : "2",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 18,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "목화솜을 원료로 하는 천연 섬유로 만든 면 소재의 옷"	},
        {	"이름" : "도포",	"등급" : "2",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 17,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주로 외투로 사용한 겉옷."	},
        {	"이름" : "우단의",	"등급" : "2",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 17,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "비단이 섞인 면 소재의 옷."	},
        {	"이름" : "직령포",	"등급" : "2",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 16,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "직령으로 된 면 소재의 도포."	},
        {	"이름" : "단장",	"등급" : "2",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 20,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "남방 민족들의 옷. 더위에 강하다."	},
        {	"이름" : "대마의",	"등급" : "2",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 18,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "마 소재의 식물의 줄기나 껍질과 함께 만든 삼베 의상."	},
        {	"이름" : "시피 전포",	"등급" : "2",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 19,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "멧돼지 가죽으로 만든 전포."	},
        {	"이름" : "요족의",	"등급" : "2",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 18,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "야오족의 전통 의상."	},
        {	"이름" : "저마의",	"등급" : "2",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 19,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "마 소재로 만든 의상."	},
        {	"이름" : "초구",	"등급" : "2",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 20,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "족제비의 일종인 담비 가죽으로 만든 전포. 겨울에도 따뜻하고 품격이 있다."	},
        {	"이름" : "호구",	"등급" : "2",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 19,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "여우 모피로 만든 전포."	},
        {	"이름" : "회족의",	"등급" : "2",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 19,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "후이족의 전통 의상."	},
        {	"이름" : "대간도",	"등급" : "2",	"종류" : "무기",	"종류2" : "창",	"공격력" : 23,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "대치도. 긴 막대 끝에 박도를 붙인 무기."	},
        {	"이름" : "대부",	"등급" : "2",	"종류" : "무기",	"종류2" : "창",	"공격력" : 23,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "거대한 자루를 가진 도끼. 서황이 즐겨 사용했다."	},
        {	"이름" : "문극",	"등급" : "2",	"종류" : "무기",	"종류2" : "창",	"공격력" : 25,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "공적을 세운 사람에게 하사한 극으로 공격력이 약해 주로 의장용으로 사용하였다."	},
        {	"이름" : "봉취도",	"등급" : "2",	"종류" : "무기",	"종류2" : "창",	"공격력" : 25,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 4,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "봉황의 주둥이처럼 칼끝이 완곡한 긴 손잡이의 창."	},
        {	"이름" : "언월도",	"등급" : "2",	"종류" : "무기",	"종류2" : "창",	"공격력" : 25,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "8척 12촌에 4근 13량의 대도. 의장용으로 주로 사용되었다."	},
        {	"이름" : "은부",	"등급" : "2",	"종류" : "무기",	"종류2" : "창",	"공격력" : 26,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창의 끝을 도끼 모양으로 만들어 은으로 장식한 무기."	},
        {	"이름" : "조자봉",	"등급" : "2",	"종류" : "무기",	"종류2" : "창",	"공격력" : 26,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "갈고리 모양의 창날로 상대를 넘어뜨리거나 말을 탄 병사를 끌어내리는 데 사용하였다."	},
        {	"이름" : "철선창",	"등급" : "2",	"종류" : "무기",	"종류2" : "창",	"공격력" : 28,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "창의 네다섯 마디 부분에 나뭇가지와 철봉을 붙여서 사용하는 무기."	},
        {	"이름" : "격적신기석류포",	"등급" : "2",	"종류" : "무기",	"종류2" : "포",	"공격력" : 26,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "진천뢰의 일종으로 석류처럼 생긴 포탄이 적군이 집는 순간 폭발해 큰 피해를 준다."	},
        {	"이름" : "분포관포",	"등급" : "2",	"종류" : "무기",	"종류2" : "포",	"공격력" : 26,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "얇은 도자기 용기에 건조 후 빻은 인분과 석회, 그리고 비상과 같은 각종 맹독성 혼합물을 집어넣은 것을 발사하는 포. 중독의 부가 효과가 있다."	},
        {	"이름" : "이화창",	"등급" : "2",	"종류" : "무기",	"종류2" : "포",	"공격력" : 28,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "화창의 개선판. 화염의 발사 시간과 거리가 개선되었다."	},
        {	"이름" : "동환식찰갑주",	"등급" : "1",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 14,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "소찰을 연결하여 중앙에서 여미는 찰갑. 착용이 편리하다."	},
        {	"이름" : "백포갑",	"등급" : "1",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 15,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "면갑의 일종인 비단 개갑. 고가의 갑옷으로 활 공격에 강하다."	},
        {	"이름" : "삼십면갑",	"등급" : "1",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 14,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "무명 30장을 겹쳐 만든 면갑. 화살에서 사용자를 보호하는 능력이 있다."	},
        {	"이름" : "조포갑",	"등급" : "1",	"종류" : "방어구",	"종류2" : "갑옷",	"공격력" : 0,	"정신력" : 0,	"방어력" : 13,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "턱까지 올라오는 면갑의 일종. 후두부를 보호해준다."	},
        {	"이름" : "대감도",	"등급" : "1",	"종류" : "무기",	"종류2" : "검",	"공격력" : 15,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "하후무가 애용한 큰 크기의 도검."	},
        {	"이름" : "삼우대도",	"등급" : "1",	"종류" : "무기",	"종류2" : "검",	"공격력" : 13,	"정신력" : 1,	"방어력" : 0,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "순우도가 애용한 검. 소를 베는 데 사용했다."	},
        {	"이름" : "오구",	"등급" : "1",	"종류" : "무기",	"종류2" : "검",	"공격력" : 14,	"정신력" : 1,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "폭이 넓은 편도이자 곡도. 오에서 많이 생산되어 이런 이름이 붙었다."	},
        {	"이름" : "왜도",	"등급" : "1",	"종류" : "무기",	"종류2" : "검",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "일본도와 유사한 형태의 도. 훗날 명나라에서 많이 사용된다."	},
        {	"이름" : "일월도",	"등급" : "1",	"종류" : "무기",	"종류2" : "검",	"공격력" : 13,	"정신력" : 1,	"방어력" : 0,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "한기가 애용한 검. 그 이름에는 신을 상징하는 의미가 담겨 있다."	},
        {	"이름" : "청운검",	"등급" : "1",	"종류" : "무기",	"종류2" : "검",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "푸른 빛깔이 감도는 명검."	},
        {	"이름" : "쌍유성",	"등급" : "1",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 13,	"정신력" : 1,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "양쪽에 추를 단 봉. 왕쌍과 변희가 애용했다."	},
        {	"이름" : "철퇴",	"등급" : "1",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가시가 박힌 둥근 봉을 휘두르는 타격무기. 월길, 학창, 제갈건 등이 사용했다."	},
        {	"이름" : "타구봉",	"등급" : "1",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 13,	"정신력" : 0,	"방어력" : 0,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "나무로 만든 몽둥이. 개방 방주의 신물이지만 성능은 그다지 좋지 않다."	},
        {	"이름" : "반곡궁",	"등급" : "1",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "궁술 시합용 활. 먼 거리의 적을 쓰러뜨리기 쉽다."	},
        {	"이름" : "화궁",	"등급" : "1",	"종류" : "무기",	"종류2" : "궁",	"공격력" : 13,	"정신력" : 0,	"방어력" : 0,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "끈을 감아 강화한 활. 공격력이 강화되어 있다."	},
        {	"이름" : "상자노",	"등급" : "1",	"종류" : "무기",	"종류2" : "노",	"공격력" : 15,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "고정 권양기식 자동장전 노. 재장전 속도가 혁신적으로 짧다."	},
        {	"이름" : "야복경과",	"등급" : "1",	"종류" : "무기",	"종류2" : "노",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "덫과 연동되는 설치형 노. 함정의 일종으로 기효신서에 나온다. 다수의 노를 끈으로 연결해 일부 노를 피하더라도 다른 노들에 의해 공격 당하는 구조. 특히 발사 간격을 조정해 예측이 어렵고 공포감을 준다."	},
        {	"이름" : "금강저",	"등급" : "1",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 12,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불교의 승려들이 수행할 때 쓰는 도구이자 고대 인도의 무기."	},
        {	"이름" : "부용검",	"등급" : "1",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 13,	"방어력" : 0,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "주로 의장에 쓰는 빛나는 보검. 각도에 따라 금, 은처럼 보인다고 한다."	},
        {	"이름" : "타신편",	"등급" : "1",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 14,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "태공망이 사용했다던 번개를 부르는 편. 타격 시 경쾌한 소리가 난다."	},
        {	"이름" : "태극보도",	"등급" : "1",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 13,	"방어력" : 0,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "태극문양이 각인된 보도. 안정적으로 술법을 쓸 수 있다."	},
        {	"이름" : "경옥대",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 1,	"정신력" : 0,	"방어력" : 1,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "기마공격강화",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "가벼운 옥 장식이 포함된 허리띠. 가범이 사용했다."	},
        {	"이름" : "고경",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 1,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "오래된 거울."	},
        {	"이름" : "구귀제법",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 3,	"방어력" : 0,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "수계책략강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "나눗셈과 구구단 제법."	},
        {	"이름" : "권모적토마",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 2,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 1,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "털이 곱슬곱슬한 적토마. 축융의 말이었다."	},
        {	"이름" : "기경육대",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 0,	"순발력" : 4,	"사기" : 1,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "여섯 갈래로 나누어진 가벼운 허리띠. 감부인이 사용했다."	},
        {	"이름" : "답교",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 3,	"방어력" : 0,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "화계책략강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "양수가 조식에게 만들어준 문답서."	},
        {	"이름" : "도참",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 3,	"방어력" : 0,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "풍계책략강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "후한의 예언서로 원술이 이 예언을 통해 자신이 황제가 되는 것이 정당하다는 이론을 설파했다."	},
        {	"이름" : "동경",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 1,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사각형 청동 거울. 잉어 그림이 각인되어 있다."	},
        {	"이름" : "백난총",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 3,	"정신력" : 0,	"방어력" : 0,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "물리공격강화",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "갈기와 발목만 검은 백마."	},
        {	"이름" : "백리총",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 2,	"순발력" : 1,	"사기" : 2,	"이동력" : 0,	"특수효과" : "험로이동",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "온몸의 털이 모두 하얀 백마."	},
        {	"이름" : "백마",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 1,	"정신력" : 1,	"방어력" : 1,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "이동력보조",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "털이 하얀 말. 온순한 성격으로 타기 편하다."	},
        {	"이름" : "사금낭",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 2,	"방어력" : 1,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "MP회복",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "관우가 긴 수염을 보호하기 위해 사용하던 주머니."	},
        {	"이름" : "사재",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 5,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "공격책략강화",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "수만 말의 시, 부, 의론을 남긴 설종의 서적."	},
        {	"이름" : "석경",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 1,	"방어력" : 0,	"순발력" : 3,	"사기" : 1,	"이동력" : 0,	"특수효과" : "MP보조",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "최초의 거울."	},
        {	"이름" : "손수레",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 2,	"정신력" : 0,	"방어력" : 1,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "HP회복",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "혼자 짐을 운반할 때 쓰는 수레."	},
        {	"이름" : "수술기유",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 3,	"방어력" : 0,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "방해계책략강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나."	},
        {	"이름" : "신서",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 4,	"방어력" : 0,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "원소책략강화",	"특수효과수치" : "3",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "고담이 쓴 20편으로 이루어진 서적."	},
        {	"이름" : "오경산술",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 3,	"방어력" : 0,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "보급계책략강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나."	},
        {	"이름" : "철술",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 3,	"방어력" : 0,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "지계책략강화",	"특수효과수치" : "5",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "산경십서의 하나. 환상의 비서."	},
        {	"이름" : "철죽사대",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 1,	"정신력" : 0,	"방어력" : 0,	"순발력" : 3,	"사기" : 1,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "대나무를 엮어 만든 허리띠. 가규가 사용했다."	},
        {	"이름" : "향낭",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 2,	"정신력" : 1,	"방어력" : 2,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "분노축적",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "허리에 매다는 향약 주머니."	},
        {	"이름" : "홍대",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 1,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 2,	"이동력" : 0,	"특수효과" : "HP보조",	"특수효과수치" : "10",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "붉게 빛나는 소재로 장식된 허리띠. 가충이 사용했다."	},
        {	"이름" : "화약",	"등급" : "1",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 3,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "2",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불을 붙이는 약."	},
        {	"이름" : "나비선",	"등급" : "1",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 14,	"방어력" : 0,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "선면의 형태가 날개를 활짝 핀 나비와 같은 모양의 나비선."	},
        {	"이름" : "박쥐선",	"등급" : "1",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 14,	"방어력" : 0,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "선면과 자루가 박쥐 형태를 한 부채. 신공 왕후가 박쥐의 날개를 보고 만들었다고 한다."	},
        {	"이름" : "선녀선",	"등급" : "1",	"종류" : "무기",	"종류2" : "선",	"공격력" : 0,	"정신력" : 15,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "선녀의 머리 모양을 본떠 만든 선녀선."	},
        {	"이름" : "연거복",	"등급" : "1",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 11,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "공직을 떠나 한가로이 지내는 사람이 입는 유교의 옷"	},
        {	"이름" : "융의",	"등급" : "1",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 10,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "일반적인 면으로 만든 옷."	},
        {	"이름" : "황의",	"등급" : "1",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 10,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "노란색 옷. 일반적으로 많이 입던 옷."	},
        {	"이름" : "회",	"등급" : "1",	"종류" : "방어구",	"종류2" : "의복",	"공격력" : 0,	"정신력" : 0,	"방어력" : 9,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "무늬 없는 비단옷"	},
        {	"이름" : "견구",	"등급" : "1",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 11,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "개 가죽으로 만든 전포."	},
        {	"이름" : "녹피 전포",	"등급" : "1",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 11,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "사슴 가죽으로 만든 전포."	},
        {	"이름" : "묘족의",	"등급" : "1",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 12,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "먀오족의 전통 의상."	},
        {	"이름" : "아마의",	"등급" : "1",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 12,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "식물의 줄기나 껍질로 천을 만든 의상. 쉽게 오염되지 않고 시원하나 보온성이 떨어지고 주름이 쉽게 생긴다."	},
        {	"이름" : "양모의",	"등급" : "1",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 11,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "양털로 만든 의상. 따뜻하고 가벼운 것이 특징이다."	},
        {	"이름" : "장포",	"등급" : "1",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 10,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "북방 민족들의 옷. 추위에 강하다."	},
        {	"이름" : "저피 전포",	"등급" : "1",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 10,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "돼지 가죽으로 만든 전포."	},
        {	"이름" : "토구",	"등급" : "1",	"종류" : "방어구",	"종류2" : "전포",	"공격력" : 0,	"정신력" : 0,	"방어력" : 11,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "토끼 가죽으로 만든 전포."	},
        {	"이름" : "극도",	"등급" : "1",	"종류" : "무기",	"종류2" : "창",	"공격력" : 15,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "상대방을 칼날로 찌르거나 잡아당겨 벨 때 사용하는 과 형태의 무기. 주로 전차전에서 사용되었다."	},
        {	"이름" : "반월창",	"등급" : "1",	"종류" : "무기",	"종류2" : "창",	"공격력" : 15,	"정신력" : 0,	"방어력" : 0,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "반달 모양의 날을 가진, 왕광이 애용한 창."	},
        {	"이름" : "삼지창",	"등급" : "1",	"종류" : "무기",	"종류2" : "창",	"공격력" : 13,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "낚시 도구에서 유래한 창. 목표에 큰 피해를 준다."	},
        {	"이름" : "선장",	"등급" : "1",	"종류" : "무기",	"종류2" : "창",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 1,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "반달 모양의 날과 삽과 같은 칼날이 양쪽에 달린 창."	},
        {	"이름" : "이지창",	"등급" : "1",	"종류" : "무기",	"종류2" : "창",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "농기구에서 유래한 창. 실용적인 성능을 갖고 있다."	},
        {	"이름" : "조목삭",	"등급" : "1",	"종류" : "무기",	"종류2" : "창",	"공격력" : 13,	"정신력" : 0,	"방어력" : 0,	"순발력" : 1,	"사기" : 2,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "단단한 대추나무로 만든 창. 강도만큼 큰 피해를 준다."	},
        {	"이름" : "참마검",	"등급" : "1",	"종류" : "무기",	"종류2" : "창",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 2,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "말을 베기 위해 제작된 거대한 창. 언월도의 원형에 해당한다."	},
        {	"이름" : "창겸",	"등급" : "1",	"종류" : "무기",	"종류2" : "창",	"공격력" : 17,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "농기구인 낫에서 발전된 무기. 찌르기 위한 날과 잡아당기면서 베는 역할을 하는 날 두 부분으로 구성되어 있다."	},
        {	"이름" : "지뢰포",	"등급" : "1",	"종류" : "무기",	"종류2" : "포",	"공격력" : 15,	"정신력" : 0,	"방어력" : 0,	"순발력" : 1,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "제갈량이 사용한 포. 폭발하는 포탄을 이용해 큰 피해를 준다."	},
        {	"이름" : "치우포",	"등급" : "1",	"종류" : "무기",	"종류2" : "포",	"공격력" : 15,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 1,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "치우의 얼굴을 그려넣은 포. 폭발에 의한 공격력이 강하다."	},
        {	"이름" : "화전",	"등급" : "1",	"종류" : "무기",	"종류2" : "포",	"공격력" : 17,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "",	"특수효과수치" : "-",	"특수효과2" : "",	"특수효과2수치" : "-",	"보물설명" : "불화살을 발사하는 포로 비도전이라고도 한다."	},
        {	"이름" : "여포의 방천화극",	"등급" : "전용",	"종류" : "무기",	"종류2" : "창",	"공격력" : 106,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "선제공격",	"특수효과수치" : "-",	"특수효과2" : "전방어율증가",	"특수효과2수치" : "0.05",	"보물설명" : "여포가 애용하는 극. 창 같은 칼날 옆에 초승달 모양의 칼날이 한쪽에만 달려 있다. 피를 좋아하는 요극이라고도 불린다."	},
        {	"이름" : "여령기의 방천극",	"등급" : "전용",	"종류" : "무기",	"종류2" : "창",	"공격력" : 104,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 20,	"이동력" : 0,	"특수효과" : "파진공격",	"특수효과수치" : "-",	"특수효과2" : "전방어율증가",	"특수효과2수치" : "0.05",	"보물설명" : "여령기가 애용하는 극. 창날의 양쪽에 월아가 달려있다."	},
        {	"이름" : "관우의 청룡언월도",	"등급" : "전용",	"종류" : "무기",	"종류2" : "창",	"공격력" : 104,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "재반격",	"특수효과수치" : "-",	"특수효과2" : "물리피해감소",	"특수효과2수치" : "0.07",	"보물설명" : "관우가 애용하는 대도. 무게가 82근이나 나갔다고 한다."	},
        {	"이름" : "장비의 장팔사모",	"등급" : "전용",	"종류" : "무기",	"종류2" : "창",	"공격력" : 104,	"정신력" : 0,	"방어력" : 0,	"순발력" : 20,	"사기" : 10,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "-",	"특수효과2" : "전방어율증가",	"특수효과2수치" : "0.05",	"보물설명" : "장비가 애용하는 8척 길이의 모. 뱀이 굽이치는 모양으로 된 칼날이 달려있다."	},
        {	"이름" : "조운의 애각창",	"등급" : "전용",	"종류" : "무기",	"종류2" : "창",	"공격력" : 115,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "무반격공격",	"특수효과수치" : "-",	"특수효과2" : "전방어율증가",	"특수효과2수치" : "0.05",	"보물설명" : "조운이 애용했다고 전해지는 장창으로 길이가 9척에 달한다."	},
        {	"이름" : "초선의 화륜",	"등급" : "전용",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 89,	"정신력" : 0,	"방어력" : 0,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "파진공격",	"특수효과수치" : "-",	"특수효과2" : "MP회복",	"특수효과2수치" : "0.05",	"보물설명" : "초선이 애용하는 곤. 현무 문양으로 장식되어 있다."	},
        {	"이름" : "여포의 적토마",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 23,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 9,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "공격방어율관통",	"특수효과2수치" : "0.1",	"보물설명" : "여포가 애용하는 말. 전신이 불꽃처럼 붉으며 이마에 X자로 흰 흉터가 있는 팔척의 말이다. 난폭한 명마로 하루에 천리를 달린다고 한다."	},
        {	"이름" : "초선의 향라수건",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 32,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "0.3",	"특수효과2" : "MP보조",	"특수효과2수치" : "0.1",	"보물설명" : "초선이 지니고 있던 비단 수건. 초선이 왕윤의 연회에서 춤을 출 때 사용하였다고 한다."	},
        {	"이름" : "여령기의 대완마",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 32,	"정신력" : 0,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "돌진공격",	"특수효과수치" : "0.03",	"특수효과2" : "이동력보조",	"특수효과2수치" : "1",	"보물설명" : "여령기가 애용하는 말. 대완국의 명마로 피처럼 붉은 땀을 흘리며 주인을 배신하지 않는다. 한혈마라고도 한다. 페르시아산."	},
        {	"이름" : "관우의 적토마",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 23,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 9,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "공격방어율관통",	"특수효과2수치" : "0.1",	"보물설명" : "관우가 애용하는 말. 전신이 불꽃처럼 붉으며 이마에 X자로 흰 흉터가 있는 팔척의 말이다. 난폭한 명마로 하루에 천리를 달린다고 한다."	},
        {	"이름" : "장비의 옥추마",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 23,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 9,	"이동력" : 0,	"특수효과" : "돌격이동",	"특수효과수치" : "-",	"특수효과2" : "물리공격강화",	"특수효과2수치" : "0.07",	"보물설명" : "장비 소유의 말. 표월오라고도 불린다. 검은 갈기에 검푸른 털을 가진 흑마."	},
        {	"이름" : "조운의 옥란백용구",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 5,	"정신력" : 0,	"방어력" : 27,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "0.3",	"특수효과2" : "이동력보조",	"특수효과2수치" : "1",	"보물설명" : "조운 소유의 말. 화려한 갈기에 흰 털의 백마."	},
        {	"이름" : "감녕의 환수도",	"등급" : "전용",	"종류" : "무기",	"종류2" : "검",	"공격력" : 103,	"정신력" : 0,	"방어력" : 0,	"순발력" : 20,	"사기" : 10,	"이동력" : 0,	"특수효과" : "파진공격",	"특수효과수치" : "-",	"특수효과2" : "물리공격강화",	"특수효과2수치" : "0.07",	"보물설명" : "손잡이 머리부분이 고리모양을 이룬 칼. 감녕이 애용했다."	},
        {	"이름" : "감녕의 패립대",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 18,	"이동력" : 0,	"특수효과" : "회심공격",	"특수효과수치" : "-",	"특수효과2" : "공격방어율관통",	"특수효과2수치" : "0.1",	"보물설명" : "감녕이 애용하는 허리띠. 조개 껍질을 가공해 장식했다."	},
        {	"이름" : "손책의 고정도",	"등급" : "전용",	"종류" : "무기",	"종류2" : "검",	"공격력" : 101,	"정신력" : 0,	"방어력" : 10,	"순발력" : 10,	"사기" : 10,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "-",	"특수효과2" : "공격방어율관통",	"특수효과2수치" : "0.1",	"보물설명" : "손책이 애용하는 검. 아주 가벼워서 장비하면 경쾌하게 움직일 수 있다."	},
        {	"이름" : "손책의 오국옥새",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 14,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 18,	"이동력" : 0,	"특수효과" : "회심공격",	"특수효과수치" : "-",	"특수효과2" : "물리피해감소",	"특수효과2수치" : "0.07",	"보물설명" : "오의 옥새. 손책의 인장이 각인되어 있다."	},
        {	"이름" : "주유의 칠성검",	"등급" : "전용",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 86,	"방어력" : 0,	"순발력" : 20,	"사기" : 10,	"이동력" : 0,	"특수효과" : "공격능력전환",	"특수효과수치" : "-",	"특수효과2" : "책략방어율관통",	"특수효과2수치" : "0.1",	"보물설명" : "주유가 애용하는 보검. 얇고 긴 형태에 일곱 개의 별이 새겨져 있다."	},
        {	"이름" : "주유의 손자병법",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 23,	"방어력" : 9,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "MP회복",	"특수효과수치" : "0.05",	"특수효과2" : "공격방어율관통",	"특수효과2수치" : "0.1",	"보물설명" : "주유가 즐겨 읽던 병법서. 춘추시대의 오나라 명장 손무가 저술했다."	},
        {	"이름" : "곽가의 무귀보도",	"등급" : "전용",	"종류" : "무기",	"종류2" : "보도",	"공격력" : 0,	"정신력" : 91,	"방어력" : 10,	"순발력" : 10,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연속책략",	"특수효과수치" : "",	"특수효과2" : "책략방어율관통",	"특수효과2수치" : "0.1",	"보물설명" : "무귀도에서 귀법을 사용할 때 쓰이는 주술용 무기. 곽가가 애용했다."	},
        {	"이름" : "곽가의 위공자병법",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 32,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "책략방어율관통",	"특수효과수치" : "0.35",	"특수효과2" : "이동력 보조",	"특수효과2수치" : "1",	"보물설명" : "곽가가 애용한 병법서. 전국사군의 한사람인 신릉군이 편찬. 제후들에게 기증받은 병법서를 하나로 모았다."	},
        {	"이름" : "서황의 백염부",	"등급" : "전용",	"종류" : "무기",	"종류2" : "창",	"공격력" : 104,	"정신력" : 0,	"방어력" : 10,	"순발력" : 20,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "",	"특수효과2" : "물리공격강화",	"특수효과2수치" : "0.07",	"보물설명" : "위나라 명장 서황이 애용했던 거대한 도끼."	},
        {	"이름" : "서황의 취화류마",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 14,	"정신력" : 9,	"방어력" : 9,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "0.3",	"특수효과2" : "이동력보조",	"특수효과2수치" : "1",	"보물설명" : "서황이 애용했던 갈색의 명마."	},
        {	"이름" : "견희의 홍라산",	"등급" : "전용",	"종류" : "무기",	"종류2" : "곤",	"공격력" : 86,	"정신력" : 0,	"방어력" : 0,	"순발력" : 20,	"사기" : 0,	"이동력" : 0,	"특수효과" : "연환공격",	"특수효과수치" : "",	"특수효과2" : "전방어율증가",	"특수효과2수치" : "0.05",	"보물설명" : "붉은 꽃물을 칠한 비단으로 만든 우산. 견희가 애용했다."	},
        {	"이름" : "견희의 자영롱대",	"등급" : "전용",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 5,	"정신력" : 0,	"방어력" : 27,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "공격명중률증가",	"특수효과수치" : "0.3",	"특수효과2" : "MP보조",	"특수효과2수치" : "35",	"보물설명" : "보랏빛 살을 엮어 만든 허리띠. 견희가 애용했다."	},
        {	"이름" : "조롱비서",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 18,	"정신력" : 9,	"방어력" : 18,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "조롱",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "상대를 조롱해 격앙시키는 각종 비책들을 적은 책. (군주계 보병계 중기병계 적병계 웅술사계 천자계)"	},
        {	"이름" : "오자",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 0,	"방어력" : 27,	"순발력" : 9,	"사기" : 0,	"이동력" : 0,	"특수효과" : "방어진",	"특수효과수치" : "1",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "전국시대 병법가 오기가 저술한 병법서. 무경칠서 중의 하나이다. (군주계 보병계 중기병계 적병계 웅술사계 천자계)"	},
        {	"이름" : "필률",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 0,	"방어력" : 9,	"순발력" : 27,	"사기" : 0,	"이동력" : 0,	"특수효과" : "교란공격",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "서역에서 전해진 피리. (궁병계 노병계 궁기병계 포차계 노전차계)"	},
        {	"이름" : "궁대",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 18,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 9,	"이동력" : 0,	"특수효과" : "강격",	"특수효과수치" : "0.05",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "궁수들이 차는 허리띠. 화살통과 소품을 장착하기 용이하게 만들어져 있다. (궁병계 노병계 궁기병계 포차계 노전차계)"	},
        {	"이름" : "성좌대",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 23,	"방어력" : 23,	"순발력" : 0,	"사기" : 0,	"이동력" : 0,	"특수효과" : "일거양득",	"특수효과수치" : "0.1",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "별자리가 그려져 있는 아름다운 허리띠. 별의 위치마다 각종 보석으로 장식되어 있다. (책사계 풍수사계 무희계 군악대계)"	},
        {	"이름" : "절지",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 36,	"정신력" : 0,	"방어력" : 0,	"순발력" : 9,	"사기" : 0,	"이동력" : 0,	"특수효과" : "파괴",	"특수효과수치" : "0.1",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "목왕 팔준의 하나. 너무나 빨라 흙을 딛지 않고 달린다고 전해지는 명마. (경기병계 무인계 전차계 수군계 호술사계)"	},
        {	"이름" : "번청패옥",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 9,	"정신력" : 9,	"방어력" : 0,	"순발력" : 9,	"사기" : 18,	"이동력" : 0,	"특수효과" : "MP공격%",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "신비하게 빛나는 푸른 빛깔의 패옥. (무희계 도독계)"	},
        {	"이름" : "각성청룡보옥",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "사신소환",	"특수효과수치" : "청룡",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "신비한 청색 보옥, 장비 시 사신 중 하나인 청룡과 교감할 수 있다. (현자계)"	},
        {	"이름" : "각성주작보옥",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "사신소환",	"특수효과수치" : "주작",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "신비한 적색 보옥, 장비 시 사신 중 하나인 주작과 교감할 수 있다. (책사계)"	},
        {	"이름" : "각성현무보옥",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "사신소환",	"특수효과수치" : "현무",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "신비한 흑색 보옥, 장비 시 사신 중 하나인 현무와 교감할 수 있다. (도사계)"	},
        {	"이름" : "각성백호보옥",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 27,	"방어력" : 0,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "사신소환",	"특수효과수치" : "백호",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "신비한 백색 보옥, 장비 시 사신 중 하나인 백호와 교감할 수 있다. (풍수사계)"	},
        {	"이름" : "기문둔갑서",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 18,	"방어력" : 9,	"순발력" : 9,	"사기" : 9,	"이동력" : 0,	"특수효과" : "책략모방",	"특수효과수치" : "",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "치우천왕과의 전쟁에서 고전 중이던 헌원황제가 꿈에서 천신에게 받은 부결을 문자로 완성한 책. (풍수사계 도사계)"	},
        {	"이름" : "맹독비",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 18,	"정신력" : 0,	"방어력" : 9,	"순발력" : 18,	"사기" : 0,	"이동력" : 0,	"특수효과" : "독살공격",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "맹독을 바른 예리한 비수. (검사계)"	},
        {	"이름" : "위료자",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 0,	"정신력" : 0,	"방어력" : 36,	"순발력" : 9,	"사기" : 0,	"이동력" : 0,	"특수효과" : "특수공격방어",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "진나라의 시황제를 섬기던 병법가 위료자가 저술한 병법서. (보병계 웅술사계 천자계)"	},
        {	"이름" : "분소",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 27,	"정신력" : 0,	"방어력" : 0,	"순발력" : 0,	"사기" : 18,	"이동력" : 0,	"특수효과" : "습격",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "목왕 팔준의 하나. 밤을 달리는 말로 하루에 수천리를 달린다고 전해지는 명마."	},
        {	"이름" : "번우",	"등급" : "7",	"종류" : "보조구",	"종류2" : "보조구",	"공격력" : 27,	"정신력" : 0,	"방어력" : 0,	"순발력" : 18,	"사기" : 0,	"이동력" : 0,	"특수효과" : "강공%",	"특수효과수치" : "0.5",	"특수효과2" : "",	"특수효과2수치" : "",	"보물설명" : "목왕 팔준의 하나. 하늘을 나는 새도 따라잡을 수 없을 만큼 빠르다고 전해지는 명마."	}
    ]
}



function configDescription() {

    return [
        {	"장수특성" : "가무",	"설명" : "노래 책략을 사용할 수 있다. (군악대 부대효과)",	},
        {	"장수특성" : "간접공격면역",	"설명" : "활과 투석기 같은 원거리 공격을 100% 방어한다. 단 혼란 시 발동하지 않는다.",	},
        {	"장수특성" : "간접피해감소",	"설명" : "원거리 공격으로 입는 피해가 n% 만큼 감소한다.",	},
        {	"장수특성" : "갈퀴공격",	"설명" : "물리 공격에 성공하면 공격자의 방향으로 1칸 끌어당긴다. 끌어당길 수 없는 경우와 연속 공격의 첫 공격은 30%의 추가 피해가 발생한다.",	},
        {	"장수특성" : "강격",	"설명" : "물리 공격 시 공격 대상과의 거리 x 5% 만큼 피해량이 증가한다. 최대 30%까지 증가한다.",	},
        {	"장수특성" : "강공%",	"설명" : "물리 공격 시 50% 확률로 연속 공격 면역 · 회심 공격 면역 · 특수 공격 면역 효과를 무시한다.",	},
        {	"장수특성" : "격파",	"설명" : "협공 · 재반격 · 인도 공격 · 파진 공격 · 분전 공격 · 지원 공격' 시 피격자의 공격 방어 확률을 n% 감소시킨 후 공격한다.",	},
        {	"장수특성" : "견직특화",	"설명" : "태수 : 견직 지역 배치 시 징세 은전 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "경작특화",	"설명" : "태수 : 경작 지역 배치 시 징세 군량 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "계포일낙",	"설명" : "협공·지원 공격 시 피해량이 50% 증가한다.",	},
        {	"장수특성" : "고금무쌍",	"설명" : "HP가 25% 미만으로 떨어질 경우 공격력이 100% 증가한다. HP가 회복되면 정상상태로 돌아온다. HP가 0이되는 공격을 받으면 1의 HP를 남기고 생존한다. 생존 효과는 전투 중 1번만 발동한다.",	},
        {	"장수특성" : "고육지계",	"설명" : "물리 공격 시 잔여 HP의 n% 양만큼 물리 피해량이 증가한다. 공격 후 잔여 HP가 n% 만큼 감소한다. 잔여 HP가 n% 미만일 경우에는 발동하지 않는다.",	},
        {	"장수특성" : "공격능력전환",	"설명" : "적을 공격할 때 총 공격력과 총 정신력 중 더 높은 피해를 줄 수 있는 능력치로 공격한다.",	},
        {	"장수특성" : "공격명중률증가",	"설명" : "물리 공격의 명중률이 n% 만큼 증가한다.",	},
        {	"장수특성" : "공격방어율관통",	"설명" : "공격 시 n% 만큼 피격자의 공격 방어 확률을 감소시킨 후 공격한다.",	},
        {	"장수특성" : "공격방어율증가",	"설명" : "물리 공격을 방어할 확률이 n% 만큼 증가한다.",	},
        {	"장수특성" : "공격범위확장",	"설명" : "공격 범위가 지정 범위로 확대된다.",	},
        {	"장수특성" : "공격책략강화",	"설명" : "모든 공격 책략 사용 시 책략의 위력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "공격력보조",	"설명" : "공격력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "공격력하강공격",	"설명" : "공격 시 피격자를 공격력 감소 상태로 만든다.",	},
        {	"장수특성" : "공방특화",	"설명" : "태수 : 공방 지역 배치 시 징세 은전 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "과수특화",	"설명" : "태수 : 과수 지역 배치 시 징세 군량 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "관성제군",	"설명" : "본대의 주변(몰우전 범위)에 존재하는 적군의 전투력을 10% 감소시킨다.",	},
        {	"장수특성" : "관통사격",	"설명" : "궁병계 궁기병계 노병계 장수가 범위 공격으로 2명 이상 공격 시 주 대상의 회심 공격 면역과 간접 공격 면역 효과를 무시한다.",	},
        {	"장수특성" : "교란공격",	"설명" : "물리 공격 명중 시 50% 확률로 공격 지정 대상을 교란 상태로 만든다. 교란에 걸린 적은 물리 공격 및 책략 시전 범위가 사방 범위로 변경된다.",	},
        {	"장수특성" : "교주약탈보조",	"설명" : "군주 : 교주 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "교주징세보조",	"설명" : "군주 : 교주 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "구사일생",	"설명" : "HP가 0이 되는 공격을 받는다면 1의 HP를 남기고 해당 턴 동안 전 방어율이 50% 증가한다. 해당 효과는 전투 중 1번만 발동한다.",	},
        {	"장수특성" : "국사무쌍",	"설명" : "MP가 n% 미만으로 떨어질 경우 정신력이 100% 증가한다. MP가 회복되면 정상상태로 돌아온다.",	},
        {	"장수특성" : "군량보관특화",	"설명" : "태수 :  모든 지역 배치 시 군량 보관 n% 증가. 7 / 9 / 11 / 13 / 15",	},
        {	"장수특성" : "군량약탈보조",	"설명" : "군주 : 공성전 시 약탈 군량 n% 증가.   2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "군량징세보조",	"설명" : "군주 : 전 지역 징세 군량 n% 증가.   2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "군량징세특화",	"설명" : "태수 : 모든 지역 배치 시 징세 군량 n% 증가. 2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "권위",	"설명" : "물리 피격 또는 책략 피격 시 적군보다 사기가 높을 경우 그 비율의 절반만큼 받는 피해량이 최대 50%까지 감소한다. (천자계 부대효과)",	},
        {	"장수특성" : "권토중래",	"설명" : "공격 시 첫 번째 공격이 실패했을 경우 연속 공격이 무조건 명중하고 특수공격면역 · 연속공격면역 · 회심공격면역효과를 무시한다.",	},
        {	"장수특성" : "귀문",	"설명" : "사신 소환 효과 없이도 날씨와 무관하게 청룡 책략을 사용할 수 있다. 단 청룡 책략 사용 시 떨어지는 벼락의 수가 3개로 변경된다.",	},
        {	"장수특성" : "근거리궁술",	"설명" : "궁병계 궁기병계 장수가 본대의 사방 범위에 위치한 적을 공격할 수 있다.",	},
        {	"장수특성" : "금격공격",	"설명" : "공격 시 n%의 확률로 적군이 공격할 수 없도록 만든다.",	},
        {	"장수특성" : "금구공격",	"설명" : "공격 시 n%의 확률로 피격자에게 아이템 사용 금지 상태이상을 건다.",	},
        {	"장수특성" : "금책공격",	"설명" : "공격 시 n% 확률로 피격자에게 금책 효과를 건다.",	},
        {	"장수특성" : "기마공격강화",	"설명" : "기마계 부대에게 n% 만큼 추가 피해를 준다.",	},
        {	"장수특성" : "기마공격강화무시",	"설명" : "기마 공격 강화 효과와 참마 창술 연구를 무시한다.",	},
        {	"장수특성" : "기습공격",	"설명" : "공격 시 이동한 거리 X n% 만큼 피격자의 공격 방어 확률을 감소시킨 후 공격한다. 이 효과는 부대 행동이 종료될 때 초기화된다.",	},
        {	"장수특성" : "기주약탈보조",	"설명" : "군주 : 기주 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "기주징세보조",	"설명" : "군주 : 기주 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "기합의일격",	"설명" : "물리 공격 성공 시 자신을 제외한 아군 장수가 30% 확률로 공격력 증가 상태가 된다.",	},
        {	"장수특성" : "강인가:물리피해감소%",	"설명" : "물리 공격으로 입는 피해가 25% 만큼 감소한다. 단 같은 노래 효과와 중복 적용되지 않는다. (군악대 MP60)",	},
        {	"장수특성" : "대책가:책략피해감소%",	"설명" : "모든 책략에 대한 피해가 25%만큼 감소한다. 단 사신 책략은 피해 감소하지 않으며 같은 노래 효과와 중복 적용되지 않는다. (군악대 MP60)",	},
        {	"장수특성" : "능력이상공격",	"설명" : "공격 시 n%의 확률로 피격자에게 능력 감소 상태이상을 무작위로 두 가지 건다.",	},
        {	"장수특성" : "다다익선",	"설명" : "본대의 ZOC(주변 8타일)에 존재하는 아군의 수 당 본대의 전투력이 4% 증가한다.",	},
        {	"장수특성" : "도구범위확장",	"설명" : "도구 사용 범위가 지정 범위로 확대된다.",	},
        {	"장수특성" : "독살공격",	"설명" : "물리 공격 명중 시 50% 확률로 피격된 적에게 독살 피해를 추가로 가한다.",	},
        {	"장수특성" : "돌격이동",	"설명" : "적군의 ZOC(공간제약)을 무력화한다.",	},
        {	"장수특성" : "돌진공격",	"설명" : "공격 시 이동한 거리 X n% 만큼 추가 피해를 준다. 이 효과는 부대 행동이 종료될 때 초기화된다.",	},
        {	"장수특성" : "돌진방어술",	"설명" : "방어력이 8%만큼 증가하고  공격 시 이동한 거리 X 2% 만큼 방어력이 추가로 증가합니다. 이 효과는 부대 행동이 시작될 때 초기화됩니다.",	},
        {	"장수특성" : "돌파공격",	"설명" : "물리 공격에 성공하면 공격자의 반대방향으로 1칸 밀어낸다. 밀어낼 수 없는 경우와 연속 공격의 첫 공격은 30%의 추가 피해가 발생한다.",	},
        {	"장수특성" : "만인지적",	"설명" : "아군 턴에 가한 공격 횟수 x 10% 만큼 공격력이 추가로 증가한다. 이 효과는 부대 행동이 종료될 때 초기화 된다.",	},
        {	"장수특성" : "맹독공격",	"설명" : "공격 시 n%의 확률로 피격자에게 맹독 효과를 건다.",	},
        {	"장수특성" : "명품상점보조",	"설명" : "군주 : 명품 상점 갱신 소모 금전 n% 감소.  2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "모의전보조",	"설명" : "군주 : 모의전 대기 시간 n% 감소. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "무반격공격",	"설명" : "공격 시 적군의 반격을 무조건 회피한다.",	},
        {	"장수특성" : "무역상점보조",	"설명" : "군주 : 무역 상점 갱신 소모 금전 n% 감소.  2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "무작위하강공격",	"설명" : "공격 시 피격자를 감소 상태 중 하나로 만든다.",	},
        {	"장수특성" : "무제한반격",	"설명" : "공격 범위와 무관하게 반드시 반격한다.",	},
        {	"장수특성" : "무한인도공격",	"설명" : "공격 시 적을 퇴각시키면 공격 범위 내의 다른 부대를 추가로 공격한다. 연속 발동이 허용된다. 단 자신 차례에만 발동한다.",	},
        {	"장수특성" : "무한파진공격",	"설명" : "공격 시 적을 퇴각시키면 이동해 공격 가능한 범위 내의 다른 부대를 추가로 공격한다. 연속 발동이 허용된다. 단 자신 차례에만 발동한다.",	},
        {	"장수특성" : "물리공격강화",	"설명" : "모든 적에게 n% 만큼 추가 피해를 준다.",	},
        {	"장수특성" : "물리피해감소",	"설명" : "물리 공격으로 입는 피해가 n% 만큼 감소한다.",	},
        {	"장수특성" : "물리피해반사",	"설명" : "물리 공격 피격 시 피해의 n%를 공격자에게 되돌린다.",	},
        {	"장수특성" : "물리필중",	"설명" : "물리 공격이 빗나가지 않는다.",	},
        {	"장수특성" : "반격강화",	"설명" : "반격의 위력이 증가한다.",	},
        {	"장수특성" : "방어능력전환",	"설명" : "물리 피격 시 방어력과 정신력 총 합의 60% 만큼의 능력치로 방어한다.",	},
        {	"장수특성" : "방어력보조",	"설명" : "방어력이 n(%) 만큼 증가한다.",	},
        {	"장수특성" : "방어력하강공격",	"설명" : "공격 시 피격자를 방어력 감소 상태로 만든다.",	},
        {	"장수특성" : "방어진",	"설명" : "적 이동 시 본대 주위 8칸의 소모 이동력을 1만큼 증가시킨다.",	},
        {	"장수특성" : "방해계책략강화",	"설명" : "방해계 책략 사용 시 책략의 위력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "방해계책략극대화",	"설명" : "방해계 책략 사용 시 책략의 위력이 n% 만큼 증가한다. 단 연속 책략이 발동하지 않는다.",	},
        {	"장수특성" : "범위책략피해감소",	"설명" : "범위 책략에 대한 피해가 n% 만큼 감소한다. 단 사신 책략에는 적용되지 않는다.",	},
        {	"장수특성" : "병주약탈보조",	"설명" : "군주 : 병주 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "병주징세보조",	"설명" : "군주 : 병주 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "보관의달인",	"설명" : "태수 : 모든 지역 배치 시 은전 보관 및 군량 보관 n% 증가.  2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "보급계책략강화",	"설명" : "보급계 책략 사용 시 책략의 위력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "보패:갈퀴계책",	"설명" : "공격 책략 성공 시 책략의 모든 피격자를 1칸 끌어당긴다. 끌어당길 수 없는 경우와 연속 책략의 첫 책략은 책략 피해량의 6%에 해당하는 추가 피해가 발생한다. 단일 지정 대상이 없는 전체 범위 책략에는 발동하지 않는다.",	},
        {	"장수특성" : "보패:감전공격",	"설명" : "물리 공격에 성공하면 35%의 확률로 피격자에게 감전 효과를 건다.",	},
        {	"장수특성" : "보패:감전면역",	"설명" : "상태이상 감전을 100% 방어한다.",	},
        {	"장수특성" : "보패:감전책략",	"설명" : "공격 책략 사용 시 50%의 확률로 책략의 단일 지정 대상만을 감전 상태로 만든다. 단일 지정 대상이 없는 전체 범위 책략(폭풍)에는 발동하지 않는다.",	},
        {	"장수특성" : "보패:금책면역",	"설명" : "상태이상 금책을 100% 방어한다.",	},
        {	"장수특성" : "보패:물리피해감소",	"설명" : "방어 시 35% 확률로 물리 공격으로 입는 피해가 n%만큼 감소한다.",	},
        {	"장수특성" : "보패:역린의무구",	"설명" : "물리 공격에 성공하면 주 피격자를 시작으로 ZOC(8방향) 확산 범위를 갖는 벼락이 최대 2명까지 확산된다. 벼락은 주 피격자에게 가한 피해의 7% 추가 피해를 준다.",	},
        {	"장수특성" : "보패:용아의무구",	"설명" : "물리 공격에 성공하면 30%의 확률로 주 피격자의 ZOC(대몰우전)에 위치한 적군에게 무작위로 벼락이 깃든 검을 최대 5개 떨어뜨린다. 각 벼락은 50의 추가 피해를 준다.",	},
        {	"장수특성" : "보패:용의분노",	"설명" : "퇴각 시 본대의 주위 8칸(ZOC)에 존재하는 적 부대에게 가전 효과를 부여한다. 단 간접 공격으로 퇴각 시 감전 효과를 부여하지 않는다.",	},
        {	"장수특성" : "보패:용조의무구",	"설명" : "물리 공격에 성공하면 50%의 확률로 거대한 벼락을 떨어뜨려 90의 추가 피해를 입힌다.",	},
        {	"장수특성" : "보패:재빠른대처",	"설명" : "지원 공격의 피해를 n% 감소시킨다. (지원 공격으로 발생하는 재반격 또한 피해가 감소한다.)",	},
        {	"장수특성" : "보패:재충전",	"설명" : "감전 상태의 적 부대에게 물리 피격 시 피해를 입은 후 피해량의 n%만큼 HP를 회복한다.",	},
        {	"장수특성" : "보패:진화",	"설명" : "본대가 화염의 표식에 대한 각성 효과를 사용할 때 3씩 감소하게 한다. 효과 책략 도구에 의한 모든 행동에 해당한다.",	},
        {	"장수특성" : "보패:책략피해감소",	"설명" : "방어 시 35% 확률로 책략 피해를 n% 감소시킨다. 단 사신 책략 피해는 감소하지 않는다.",	},
        {	"장수특성" : "보패:파동의무구",	"설명" : "물리 공격에 성공하면 공격자의 반대방향으로 1칸 밀어낸다. 밀어낼 수 없는 경우와 연속 공격의 첫 공격은 최대 HP의 5%만큼 추가 피해가 발생한다. 단 추가 피해는 공격자 공격력의 10%를 초과할 수 없다.",	},
        {	"장수특성" : "보패:혼란면역",	"설명" : "상태이상 혼란을 100% 방어한다.",	},
        {	"장수특성" : "보패:화검계책",	"설명" : "공격 책략 성공 시 주 피격자를 시작으로 몰우전 범위 내 최대 2명의 적 부대에게 확산되는 화염의 칼날 공격을 한다. 화염의 칼날은 주 피격자에게 가한 피해의 3%에 해당하는 피해를 주고 화염의 표식을 1 부여한다.",	},
        {	"장수특성" : "보패:화염계책",	"설명" : "공격 책략 성공 시 100%의 확률로 책략 지정 대상의 위채에 화염 지형을 생성한다.",	},
        {	"장수특성" : "보패:화염공격",	"설명" : "물리 공격 성공 시 50%의 확률로 공격 지정 대상에게만 70의 추가 피해를 입히고 피격자에게 화염의 표식을 1건다.",	},
        {	"장수특성" : "보패:화염뢰계책",	"설명" : "공격 책략 성공 시 100%의 확률로 화염의 꽃을 피워 책략 지정 대상에게 화염의 표식을 1걸고 대상 위치에 화염 지형을 생성한다.",	},
        {	"장수특성" : "보패:화염의분노",	"설명" : "퇴각 시 본대의 주위 8칸(ZOC)에 화염 지형을 생성하고 범위 내 모든 적에게 부동 상태이상을 부여한다.",	},
        {	"장수특성" : "보패:화염의장벽",	"설명" : "책략 사용시 15% 확률로 본대에 화염의 장벽 효과를 1 부여한다 최대 2개까지  중첩 가능하다. 연속 책략에는 발동하지 않는다.",	},
        {	"장수특성" : "보패:화절",	"설명" : "물리 공격 성공 시 주 대상이 가진 화염의 표식을 모두 제거하고 화염의 표식 1당 피해량의 15%만큼 추가 피해를 준다. 화염의 표식이 2 이상 부여된 경우에만 발동하며 표식 1당 추가 피해량은 공격력의 10%를 초과 할 수 없다.",	},
        {	"장수특성" : "보패:화폭계책",	"설명" : "공격 책략 성공 시 50%의 확률로 책략 지정 대상과 주위 십자 범위에 화염 폭발을 일으켜 각각50의 추가 피해를 주고 화염 지형을 생성한다.",	},
        {	"장수특성" : "보패:확산계책",	"설명" : "공격 책략 성공 시 상대를 1칸 밀어낸다. 밀어낼 수 없는 경우와 연속 책략의 첫 책략은 책략 피해량의 10%에 해당하는 추가 피해가 발생한다. 범위 책략 시에는 주 대상에게만 적용된다.",	},
        {	"장수특성" : "보패:MP파괴공격",	"설명" : "물리 공격에 성공하면 피해량의 50% 만큼 상대의 MP를 추가로 감소시킨 후 피해를 입힌다.",	},
        {	"장수특성" : "보패:화염의보복",	"설명" : "화염의 가호로 보패 효과에 의한 위치 이동 효과에 면역되고 이동하지 않아서 생기는 추가 피해를 공격자에게 100% 전가한다.",	},
        {	"장수특성" : "본대강행",	"설명" : "매 턴 시작 시 이동력 증가 상태가 된다.",	},
        {	"장수특성" : "본대견고",	"설명" : "매 턴 시작 시 방어력 증가 상태가 된다.",	},
        {	"장수특성" : "본대고양",	"설명" : "매 턴 시작 시 사기 증가 상태가 된다.",	},
        {	"장수특성" : "본대기합",	"설명" : "매 턴 시작 시 공격력 증가 상태가 된다.",	},
        {	"장수특성" : "본대연병",	"설명" : "매 턴 시작 시 순발력 증가 상태가 된다.",	},
        {	"장수특성" : "본대패기",	"설명" : "매 턴 시작 시 모든 능력치 증가 상태가 된다.",	},
        {	"장수특성" : "본대각성",	"설명" : "매턴 장수의 상태이상이 회복된다.",	},
        {	"장수특성" : "부동공격",	"설명" : "공격 시 n%의 확률로 피격자에게 부동 효과를 건다.",	},
        {	"장수특성" : "부동면역",	"설명" : "상태이상 부동을 100% 방어한다.",	},
        {	"장수특성" : "분노축적",	"설명" : "적군 턴에 받은 물리 공격 횟수 X n% 만큼 공격력이 추가로 증가한다. 이 효과는 부대 행동이 종료될 때 초기화된다.",	},
        {	"장수특성" : "분전공격",	"설명" : "공격 범위 내의 적 전체를 한 번씩 공격한다. 단 자신 차례에만 발동하며 공격 대상 숫자가 늘어날 때마다 피해량이 10% 만큼 감소한다.",	},
        {	"장수특성" : "사기보조",	"설명" : "사기가 n% 만큼 증가한다.",	},
        {	"장수특성" : "사기하강공격",	"설명" : "공격 시 피격자를 사기 감소 상태로 만든다.",	},
        {	"장수특성" : "사기충전",	"설명" : "본대의 ZOC(주변 8타일)에 존재하는 아군의 수 당 본대의 사기가 10% 증가한다. (천자계 부대효과)",	},
        {	"장수특성" : "사신보옥착용",	"설명" : "청룡 ·주작 · 현무 · 백호 보옥을 착용할 수 있게 된다.",	},
        {	"장수특성" : "사신소환",	"설명" : "사신 책략을 사용할 수 있다.",	},
        {	"장수특성" : "사신소환",	"설명" : "사신책략을 사용할 수 있다.",	},
        {	"장수특성" : "사주약탈보조",	"설명" : "군주 : 사주 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "사주징세보조",	"설명" : "군주 : 사주 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "산전특화",	"설명" : "산과 관련된 지형에서 유리한 효과를 받는다. 추가로 폭암·거암 책략을 습득한다.",	},
        {	"장수특성" : "상태이상공격",	"설명" : "공격 시 n% 확률로 피격자에게 무작위로 속성이상을 건다.",	},
        {	"장수특성" : "상태이상면역",	"설명" : "각종 상태이상을 100% 방어한다.",	},
        {	"장수특성" : "상태이상반사",	"설명" : "적군의 공격에 상태이상 효과가 있을 시 피해 없이 그 효과를 적군에게 되돌린다.",	},
        {	"장수특성" : "상태:감전",	"설명" : "방어력·정신력 감소 20% 이동력 감소 2 용조·용아·역린 피해량 50%증가",	},
        {	"장수특성" : "상태:공격금지",	"설명" : "공격 불가",	},
        {	"장수특성" : "상태:공격력감소",	"설명" : "공격력 감소 30%",	},
        {	"장수특성" : "상태:공격력감소2",	"설명" : "공격력 감소 40%",	},
        {	"장수특성" : "상태:공격력증가",	"설명" : "공격력 증가 20%",	},
        {	"장수특성" : "상태:공격력증가2",	"설명" : "공격력 증가 30%",	},
        {	"장수특성" : "상태:금책",	"설명" : "책략 사용 불가",	},
        {	"장수특성" : "상태:도구금지",	"설명" : "도구 사용 불가",	},
        {	"장수특성" : "상태:맹독",	"설명" : "매 턴 HP 감소 10% / 순발력 감소 30% / 이동력 감소 1",	},
        {	"장수특성" : "상태:방어력감소",	"설명" : "방어력 감소 30%",	},
        {	"장수특성" : "상태:방어력감소2",	"설명" : "방어력 감소 40%",	},
        {	"장수특성" : "상태:방어력증가",	"설명" : "방어력 증가 20%",	},
        {	"장수특성" : "상태:방어력증가2",	"설명" : "방어력 증가 30%",	},
        {	"장수특성" : "상태:보물금지",	"설명" : "보물 효과 금지",	},
        {	"장수특성" : "상태:부동",	"설명" : "이동 불가",	},
        {	"장수특성" : "상태:사기감소",	"설명" : "사기 감소 30%",	},
        {	"장수특성" : "상태:사기감소2",	"설명" : "사기 감소 40%",	},
        {	"장수특성" : "상태:사기증가",	"설명" : "사기 증가 20%",	},
        {	"장수특성" : "상태:사기증가2",	"설명" : "사기 증가 30%",	},
        {	"장수특성" : "상태:순발력감소",	"설명" : "순발력 감소 30%",	},
        {	"장수특성" : "상태:순발력감소2",	"설명" : "순발력 감소 40%",	},
        {	"장수특성" : "상태:순발력증가",	"설명" : "순발력 증가 20%",	},
        {	"장수특성" : "상태:순발력증가2",	"설명" : "순발력 증가 30%",	},
        {	"장수특성" : "상태:실명",	"설명" : "모든 능력치 감소 10% / 이동력 감소 1",	},
        {	"장수특성" : "상태:역린충전",	"설명" : "역린 충전 중",	},
        {	"장수특성" : "상태:용아충전",	"설명" : "용아 충전 중",	},
        {	"장수특성" : "상태:용조충전",	"설명" : "용조 충전 중",	},
        {	"장수특성" : "상태:이동력증가",	"설명" : "이동력 증가 2",	},
        {	"장수특성" : "상태:이동력증가2",	"설명" : "이동력 증가 3",	},
        {	"장수특성" : "상태:재생",	"설명" : "매 턴 HP 회복 10%",	},
        {	"장수특성" : "상태:중독",	"설명" : "매 턴 HP 감소 10%",	},
        {	"장수특성" : "상태:출혈",	"설명" : "매 턴 HP 감소 10% / 공격력 감소 30% / 이동력 감소 1",	},
        {	"장수특성" : "상태:파동충전",	"설명" : "파동 충전 중",	},
        {	"장수특성" : "상태:혼란",	"설명" : "조작 불가",	},
        {	"장수특성" : "상태:화상",	"설명" : "매 턴 HP 감소 10% / 방어력 감소 30% / 이동력 감소 1",	},
        {	"장수특성" : "상태:화염의장벽",	"설명" : "중첩당 1회 방어 가능. 피격 시 피해량을 1로 변경. 단 추가 피해는 방어가 불가능 하며 적의 공격을 회피 할 수 없음",	},
        {	"장수특성" : "상태:화염의표식",	"설명" : "매 턴  HP 감소 n% / 받는 피해 n% 증폭 / 화염 지형에서 벗어나면 1감소 (8중첩 35%) ",	},
        {	"장수특성" : "상태이상반사무시",	"설명" : "상태이상 반사 효과를 무시하고 대상에게 상태를 부여한다. (도사계 부대효과)",	},
        {	"장수특성" : "서주약탈보조",	"설명" : "군주 : 서주 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "서주징세보조",	"설명" : "군주 : 서주 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "선제공격",	"설명" : "공격 범위 내의 적군이 본대를 공격할 때 먼저 공격을 가한다. 단  '협공 · 인도 공격 · 파진 공격 · 분전 공격' 시 발동하지 않는다.",	},
        {	"장수특성" : "선제공격면역",	"설명" : "선제 공격을 받지 않는다.",	},
        {	"장수특성" : "소모품자동사용",	"설명" : "공격당해 체력을 잃을 때마다 회복의 ?을 사용한다.",	},
        {	"장수특성" : "소패왕",	"설명" : "적군의 수 x n% 만큼 공격력과 방어력이 증가한다. 최대 15%까지 증가한다.",	},
        {	"장수특성" : "수계책략강화",	"설명" : "수계 책략 사용 시 책략의 위력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "수계책략전문화",	"설명" : "수계 책략 사용 시 책략의 위력이 n%만큼 증가하고 지형과 무관하게 수계 책략을 사용할 수 있다.",	},
        {	"장수특성" : "수계책략특화",	"설명" : "수계 책략 사용 시 책략의 위력과 명중률이 n% 만큼 증가한다.",	},
        {	"장수특성" : "수산물특화",	"설명" : "태수 : 수산물 지역 배치 시 징세 군량 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "수전보조",	"설명" : "물과 관련된 지형에서 유리한 효과를 받는다. 추가로 물리 공격 명중률이 10% 증가하고 물리 공격 시 10% 만큼 추가 피해를 준다.",	},
        {	"장수특성" : "수전특화",	"설명" : "완류 설원 습지 빙판에서 유리한 지형 효과를 받는다. 추가로 폭우 책략을 습득한다.",	},
        {	"장수특성" : "순발력보조",	"설명" : "순발력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "순발력하강공격",	"설명" : "공격 시 피격자를 순발력 감소 상태로 만든다.",	},
        {	"장수특성" : "습격",	"설명" : "공격 실패 시 반격 피해량이 50% 만큼 감소한다. 연속 공격 시 한 번이라도 공격이 실패하면 피해량이 감소한다.",	},
        {	"장수특성" : "시장특화",	"설명" : "태수 : 시장 지역 배치 시 징세 은전 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "신기묘산",	"설명" : "본대와 적군의 지력을 비교하여 지력 차이의 절반만큼 원소 책략의 피해량과 명중률이 최대 25%까지 증가한다. 단 전 범위 책략에는 적용되지 않는다.",	},
        {	"장수특성" : "신출귀몰",	"설명" : "아군 턴에는 공격력 10% 향상 상태가 되고 적군 턴에는 방어력 10% 향상 상태가 된다. 이 효과는 각 세력 턴이 종료될 때 초기화된다. 단 만능계의 부대는 공격력과 정신력 둘 다 상승한다.",	},
        {	"장수특성" : "양돈특화",	"설명" : "태수 : 양돈 지역 배치 시 징세 군량 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "양주(남)약탈보조",	"설명" : "군주 : 양주(남) 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "양주(남)징세보조",	"설명" : "군주 : 양주(남) 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "양주(북)약탈보조",	"설명" : "군주 : 양주(북) 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "양주(북)징세보조",	"설명" : "군주 : 양주(북) 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "역발산기개세",	"설명" : "본대보다 무력이 낮은 적군 공격 시 무력 차이의 절반 만큼 물리 공격의 피해량과 명중률이 최대 25%까지 증가한다. 단 범위 공격 시에는 주 대상에게만 적용된다.",	},
        {	"장수특성" : "역전용사",	"설명" : "HP가 35% 미만으로 떨어질 경우 공격력·방어력이 35% 증가한다. HP가 회복되면 정상상태로 돌아온다.",	},
        {	"장수특성" : "연속공격강화",	"설명" : "연속 공격 시 추가 공격의 위력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "연속공격면역",	"설명" : "적군의 연속 공격을 100% 방어한다. 단  '협공 · 재반격 · 인도 공격 · 파진 공격 · 분전 공격 ·지원 공격' 시 발동하지 않는다.",	},
        {	"장수특성" : "연속반격",	"설명" : "적에게 무조건 연속 반격을 가한다.",	},
        {	"장수특성" : "연속책략",	"설명" : "공격 책략 사용 시 연속으로 책략을 사용한다.",	},
        {	"장수특성" : "연속책략강화",	"설명" : "연속 책략 시 추가 책략의 위력이 증가한다.",	},
        {	"장수특성" : "연속책략면역",	"설명" : "적군의 연속 책략을 100% 방어한다.",	},
        {	"장수특성" : "연주약탈보조",	"설명" : "군주 : 연주 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "연주징세보조",	"설명" : "군주 : 연주 지역 징세 은전 및 군량 n%증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "연환공격",	"설명" : "공격과 반격 시 무조건 연속 공격을 가한다.",	},
        {	"장수특성" : "연환계",	"설명" : "화계 책략 명중시 주 피격자 ZOC(주변 8타일)에 존재하는 최대 2명의 적군에게 피해가 확산된다. 확산 피해는 주 피격자에게 가한 피해의 30% 만큼 준다. 범위 책략에는 발동하지 않는다.",	},
        {	"장수특성" : "예주약탈보조",	"설명" : "군주 : 예주 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "예주징세보조",	"설명" : "군주 : 예주 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "옹주(동)약탈보조",	"설명" : "군주 : 옹주(동) 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "옹주(동)징세보조",	"설명" : "군주 : 옹주(동) 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "옹주(서)약탈보조",	"설명" : "군주 : 옹주(서) 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "옹주(서)징세보조",	"설명" : "군주 : 옹주(서) 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "운기조식",	"설명" : "MP가 1 이상인 경우 정신력이 20% 증가하며 물리 피격 시 HP 대신 MP를 모두 소모한다. 단 MP가 0일 경우에는 정신력이 20% 감소하고 물리 피격 시 HP를 소모한다.",	},
        {	"장수특성" : "원소책략강화",	"설명" : "원소(화·수·지·풍) 책략 사용 시 책략의 위력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "위풍",	"설명" : "물리 공격 또는 책략 공격 시 적군보다 사기가 높을 경우 그 비율의 절반만큼 주는 피해량이 최대 75%까지 증가한다. (천자계 부대효과)",	},
        {	"장수특성" : "유주약탈보조",	"설명" : "군주 : 유주 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "유주징세보조",	"설명" : "군주 : 유주 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "유혹책략강화",	"설명" : "유혹 책략 사용 시 공격력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "유혹책략명중률증가",	"설명" : "유혹 책략의 명중률이 n% 만큼 증가한다.",	},
        {	"장수특성" : "은전보관특화",	"설명" : "태수 :  모든 지역 배치 시 은전 보관 n%증가. 7 / 9 / 11 / 13 / 15",	},
        {	"장수특성" : "은전약탈보조",	"설명" : "군주 : 공성전 시 약탈 은전 n% 증가.   2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "은전징세보조",	"설명" : "군주 : 전 지역 징세 은전 n% 증가. 2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "은전징세특화",	"설명" : "태수 : 모든 지역 배치 시 징세 은전 n% 증가.  2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "이동력보조",	"설명" : "이동력이 2 만큼 증가한다.",	},
        {	"장수특성" : "이동력하강공격",	"설명" : "공격 시 피격자를 이동력 감소 상태로 만든다.",	},
        {	"장수특성" : "이주약탈보조+",	"설명" : "군주 : 이주 지역 공성전 시 약탈 재화 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "익주(남)약탈보조",	"설명" : "군주 : 익주(남) 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "익주(남)징세보조",	"설명" : "군주 : 익주(남) 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "익주(북)약탈보조",	"설명" : "군주 : 익주(북) 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "익주(북)징세보조",	"설명" : "군주 : 익주(북) 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "익주(중)약탈보조",	"설명" : "군주 : 익주(중) 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "익주(중)징세보조",	"설명" : "군주 : 익주(중) 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "인도공격",	"설명" : "공격 시 적을 퇴각시키면 공격 범위 내의 다른 부대를 추가로 공격한다. 단 자신 차례에만 발동한다.",	},
        {	"장수특성" : "일거양득",	"설명" : "회복 책략 사용 시 HP 회복량의 10% 만큼 MP도 함께 회복시킨다.",	},
        {	"장수특성" : "일격필살",	"설명" : "공격 시 50% 만큼 추가 피해를 준다. 단 연속 공격과 연속 반격이 발동하지 않는다.",	},
        {	"장수특성" : "일기당천",	"설명" : "본대의 ZOC(주변 8타일)에 아군이 없으면 본대의 전투력이 10% 증가한다.",	},
        {	"장수특성" : "일책필살",	"설명" : "공격 책략 사용시 위력이 n%만큼 증가한다. 단 연속 책략이 발동하지 않는다.",	},
        {	"장수특성" : "일치단결",	"설명" : "본대의 ZOC(주변 8타일)에 존재하는 아군의 수 당 3% 전투력이 증가하고 적군은 전투력 3% 감소한다.",	},
        {	"장수특성" : "장거리궁술",	"설명" : "공격 범위가 1칸 증가한다. 단 추가 공격 범위에 공격 시 공격 명중률이 15% 감소한다.",	},
        {	"장수특성" : "장계취계",	"설명" : "책략 피격 시 피해가 20% 감소하고 감소한 피해를 공격자에게 전가한다.",	},
        {	"장수특성" : "재반격",	"설명" : "적군의 반격에 맞서 반격할 수 있다. (반격 시 공격력은 기본 공격력의 0.75배)",	},
        {	"장수특성" : "전방어율증가",	"설명" : "물리 공격과 해로운 책략을 방어할 확률이 n% 만큼 증가한다.",	},
        {	"장수특성" : "전약탈보조",	"설명" : "군주 :  공성전 시 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "전징세보조",	"설명" : "군주 : 전 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "전화위복",	"설명" : "HP가 2% 감소할 때마다 전체 능력이 1%씩 증가한다. 단 섬멸전에서는 체력 50%부터 발동하여 1%감소할 때마다 전체 능력이 1%씩 증가한다.",	},
        {	"장수특성" : "절대보호특화",	"설명" : "태수 : 모든 지역 배치 시 절대 보호 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "점령보조",	"설명" : "군주 : 공성전 전투 결과에 상관없이 점령률 n% 증가 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "접근사격",	"설명" : "적과의 거리가 가까울수록 물리 공격 시 피해량이 증가한다. 최대 20%까지 증가한다.",	},
        {	"장수특성" : "정신력보조",	"설명" : "정신력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "정신력하강공격",	"설명" : "공격 시 피격자를 정신력 감소 상태로 만든다.",	},
        {	"장수특성" : "정찰보조",	"설명" : "군주 : 대상 변경 시 소모 은전 n% 감소. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "제재소특화",	"설명" : "태수 : 제재소 지역 배치 시 징세 은전 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "조가창술",	"설명" : "공격 범위 내의 적을 3회 공격한다. 조가창술 공격은 기본 피해량의 60% 만큼 피해를 주며 연속 공격 면역 효과를 무시한다. 연속공격·연속반격·재반격·일격필살효과가 발동하지 않는다.",	},
        {	"장수특성" : "조롱",	"설명" : "물리 공격 명중 시 50% 확률로 피격된 적을 격앙 상태로 만든다. 격앙에 걸린 적은 자신에게 격앙 효과를 부여한 적만 공격 대상으로 지정 가능하며 선제공격효과를 무시한다.",	},
        {	"장수특성" : "조준사격",	"설명" : "물리 공격 시 남은 이동력 x 4% 만큼 추가 피해를 준다. 이 효과는 부대 행동이 종료될 때 초기화 되며 자신의 차례에만 발동한다. 최대 40%까지 증가한다.",	},
        {	"장수특성" : "주동공격",	"설명" : "공격 시 무조건 연속 공격을 가한다.",	},
        {	"장수특성" : "주위각성",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 아군의 해로운 상태이상을 회복한다.",	},
        {	"장수특성" : "주위강행",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 아군이 이동력 증가 상태가 된다.",	},
        {	"장수특성" : "주위견고",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 아군이 방어력 증가 상태가 된다.",	},
        {	"장수특성" : "주위고양",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 아군이 사기 증가 상태가 된다.",	},
        {	"장수특성" : "주위기합",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 아군이 공격력 증가 상태가 된다.",	},
        {	"장수특성" : "주위둔병",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 적군이 순발력 감소 상태가 된다.",	},
        {	"장수특성" : "주위방해",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 적군이 정신력 감소 상태가 된다.",	},
        {	"장수특성" : "주위압박",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 적군이 공격력 감소 상태가 된다.",	},
        {	"장수특성" : "주위연병",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 아군이 순발력 증가 상태가 된다.",	},
        {	"장수특성" : "주위욕설",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 적군이 방어력 감소 상태가 된다.",	},
        {	"장수특성" : "주위저지",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 적군이 이동력 감소 상태가 된다.",	},
        {	"장수특성" : "주위집중",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 아군이 정신력 증가 상태가 된다.",	},
        {	"장수특성" : "주위허탈",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 적군이 사기 감소 상태가 된다.",	},
        {	"장수특성" : "주위HP회복",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 아군의 HP가 최대 HP의 n%만큼 회복된다.",	},
        {	"장수특성" : "주위MP회복",	"설명" : "매 턴 시작 시 본대의 주위 8칸(ZOC)에 존재하는 아군의 MP가 최대 MP의 n%만큼 회복된다.",	},
        {	"장수특성" : "중독공격",	"설명" : "공격 시 n%의 확률로 피격자에게 중독 효과를 건다.",	},
        {	"장수특성" : "중독면역",	"설명" : "상태이상 중독을 100% 방어한다.",	},
        {	"장수특성" : "중황태을",	"설명" : "공격 책략 사용 시 잔여 HP의 15% 양만큼 책략 피해량이 증가한다. 공격 후 잔여 HP가 10% 만큼 감소한다. 잔여 HP가 10미만일 경우와 전체 범위 책략에는 발동하지 않는다. 범위 책략 시에는 주 대상에게만 발동한다. 단 청룡 책략 사용 시에는 첫 번째 책략에만 적용.",	},
        {	"장수특성" : "지계책략강화",	"설명" : "지계 책략 사용 시 책략의 위력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "지원공격",	"설명" : "자신의 사정거리 내에 아군 공격시 60% 피해량으로 추가 공격한다. 단 협공·인도 공격·파진 공격·분전 공격 시 발동하지 않는다.",	},
        {	"장수특성" : "지형효과보조",	"설명" : "불리한 지형에서 받는 불리한 효과를 무효로 한다.",	},
        {	"장수특성" : "집중의일격",	"설명" : "물리 공격 성공 시 자신을 제외한 아군 장수가 30% 확률로 정신력 증가 상태가 된다.",	},
        {	"장수특성" : "징세의달인",	"설명" : "태수 : 모든 지역 배치 시 징세 은전 및 군량 n% 증가. 2 / 4 /  6 / 8 / 10",	},
        {	"장수특성" : "책략날씨무시",	"설명" : "날씨와 무관하게 책략을 사용할 수 있다.",	},
        {	"장수특성" : "책략명중률증가",	"설명" : "책략의 명중률이 n% 만큼 증가한다.",	},
        {	"장수특성" : "책략모방",	"설명" : "본대의 주변에 존재하는 모든 부대의 책략 중 같은 자원을 사용하는 책략을 사용할 수 있다. 책략 모방에 의해 사용 가능하게 된 책략으로 얻는 부대의 Exp는 2로 고정된다.",	},
        {	"장수특성" : "책략방어술",	"설명" : "책략 면역률이 20%만큼 증가하고  공격 책략에 피격될 때마다 책략 면역률이 n%만큼 추가로 증가합니다. *책략 면역률: 해로운 책략을 방어할 확률  책략 방어율 관통 효과로도 책략 면역률 효과는 상쇄할 수 없습니다.",	},
        {	"장수특성" : "책략방어율관통",	"설명" : "책략 사용 시 n% 만큼 피격자의 책략 방어 확률을 감소시킨 후 책략을 사용한다.",	},
        {	"장수특성" : "책략방어율증가",	"설명" : "해로운 책략을 방어할 확률이 n% 만큼 증가한다.",	},
        {	"장수특성" : "책략지형무시",	"설명" : "지형과 무관하게 책략을 사용할 수 있다.",	},
        {	"장수특성" : "책략파쇄",	"설명" : "사신 책략을 포함한 모든 책략에 대한 피해가 80% 만큼 감소한다.",	},
        {	"장수특성" : "책략피해감소",	"설명" : "모든 책략에 대한 피해가 n% 만큼 감소한다. 단 사신 책략은 피해 감소하지 않음.",	},
        {	"장수특성" : "책략피해반사",	"설명" : "책략 피격 시 피해의 n%를 공격자에게 되돌린다. 단 사신 책략은 피해 반사하지 않음.",	},
        {	"장수특성" : "천하무쌍",	"설명" : "HP가 35% 미만으로 떨어질 경우 공격력이 60% 증가한다. HP가 회복되면 정상상태로 돌아온다.",	},
        {	"장수특성" : "청룡의가호",	"설명" : "선제 공격과 상태이상 혼란을 100% 방어하며 받는 물리 피해량이 25% 감소한다.",	},
        {	"장수특성" : "청룡의축복",	"설명" : "공격 시 HP대 대신 MP를 소진시키고 MP가 0이되면 HP를 소진시킨다. 받는 물리 피해량이 5% 감소한다.",	},
        {	"장수특성" : "청주약탈보조",	"설명" : "군주 : 청주 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "청주징세보조",	"설명" : "군주 : 청주 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "출진군량보조",	"설명" : "군주 : 출진 시 소모 군량 n% 감소. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "출혈공격",	"설명" : "공격 시 일정 확률로 피격자에게 출혈 효과를 겁니다.",	},
        {	"장수특성" : "특수공격면역",	"설명" : "적군의 특수 공격(회심·연속 공격 연속 책략)을 100% 방어한다. 단  '협공·재반격·인도 공격·파진 공격·분전 공격·지원 공격' 시 특수 공격 면역이 발동하지 않는다.",	},
        {	"장수특성" : "특수공격방어",	"설명" : "피격 시 50% 확률로 적군의 특수 공격(회심·연속공격 연속책략)을 방어한다. 단 협공 재반격 인도공격 파진공격 분전공격 지원공격 시 특수 공격 방어 효과가 발동하지 않는다.",	},
        {	"장수특성" : "파괴",	"설명" : "물리 공격 명중 시 피격된 적군의 방어력을 10%만큼 무시하고 공격한다.",	},
        {	"장수특성" : "파부침주",	"설명" : "본대의 전투력이 15% 증가한다. 단 책략을 통해 HP를 회복하면 전투력 증가 효과가 사라지고 2턴간 전투력 15% 감소 상태가 된다.",	},
        {	"장수특성" : "파진공격",	"설명" : "공격 시 적을 퇴각시키면 이동해 공격 가능한 범위 내의 다른 부대를 추가로 공격한다. 단 자신 차례에만 발동한다.",	},
        {	"장수특성" : "포용",	"설명" : "속성이 HP 회복인 책략을 사용한 경우 회복 대상에게 재생 상태를 추가로 부여한다. (군악대 부대효과)",	},
        {	"장수특성" : "풍계책략강화",	"설명" : "풍계 책략 사용 시 책략의 위력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "풍계책략전문화",	"설명" : "풍계 책략 사용 시 책략의 위력이 20% 만큼 증가하고 지형과 무관하게 풍계 책략을 사용할 수 있다.",	},
        {	"장수특성" : "풍계책략특화",	"설명" : "풍계 책략 사용 시 책략의 위력과 명중률이 20%만큼 증가한다.",	},
        {	"장수특성" : "풍계책략극대화",	"설명" : "풍계 책략 사용 시 책략의 위력이 n% 만큼 증가한다. 단 연속 책략이 발동하지 않는다.",	},
        {	"장수특성" : "피해범위확장",	"설명" : "피해 범위가 지정 범위로 확대된다.",	},
        {	"장수특성" : "피해전가",	"설명" : "공격 범위 내에 복수의 적군이 있을 때 물리 피격 시 피해가 30% 감소하고 감소한 피해를 HP가 낮은 적에게 전가한다.",	},
        {	"장수특성" : "피해분배",	"설명" : "피해를 입을 경우 피해량의 50%를 본대의 주위 8칸(ZOC)에 존재하는 무작위 아군 1부대에게 전가한다.",	},
        {	"장수특성" : "필마단기",	"설명" : "적군의 수 x n% 만큼 방어력이 증가한다. 최대 30%까지 증가한다.",	},
        {	"장수특성" : "항만특화",	"설명" : "태수 : 항만 지역 배치 시 징세 은전 n% 증가. 3 / 6 / 9 / 12 / 15",	},
        {	"장수특성" : "험로이동",	"설명" : "이동 가능한 지형에서의 이동력 소모를 1로 줄여준다.",	},
        {	"장수특성" : "형주(남)약탈보조",	"설명" : "군주 : 형주(남) 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "형주(남)징세보조",	"설명" : "군주 : 형주(남) 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "형주(북)약탈보조",	"설명" : "군주 : 형주(북) 지역 공성전 약탈 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "형주(북)징세보조",	"설명" : "군주 : 형주(북) 지역 징세 은전 및 군량 n% 증가. 4 / 8 / 12 / 16 / 20",	},
        {	"장수특성" : "호위",	"설명" : "본대 주위 8칸(ZOC)에 존재하는 아군이 받는 모든 단일 피해를 자신이 대신 입는다. 단 대신 피해를 입을 경우 10% 경감하여 입으며 회심 공격 면역 · 연속 공격 면역 ·연속 책략 면역이 적용되지 않는다. 범위 피해와 피해량이 없는 책략 ·  '인도·파진·분전' 공격에는 발동되지 않는다.",	},
        {	"장수특성" : "혼란공격",	"설명" : "공격 시 n%의 확률로 피격자에게 혼란 효과를 건다.",	},
        {	"장수특성" : "혼란면역",	"설명" : "상태이상 혼란을 100% 방어한다.",	},
        {	"장수특성" : "홍련탄강화",	"설명" : "홍련탄 사용 시 위력이 20% 만큼 증가한다.",	},
        {	"장수특성" : "화계책략강화",	"설명" : "화계 책략 사용 시 책략의 위력이 n% 만큼 증가한다.",	},
        {	"장수특성" : "화계책략전문화",	"설명" : "화계 책략 사용 시 책략의 위력이 15% 만큼 증가하고 지형 및 날씨와 무관하게 화계 책략을 사용할 수 있다.",	},
        {	"장수특성" : "화계책략특화",	"설명" : "화계 책략 및 홍련탄 사용 시 책략의 위력과 명중률이 n%만큼 증가한다.",	},
        {	"장수특성" : "화계책략극대화",	"설명" : "화계 책략 사용 시 책략의 위력이 n% 만큼 증가한다. 단 연속 책략이 발동하지 않는다.",	},
        {	"장수특성" : "화상공격",	"설명" : "공격 시 n%의 확률로 피격자에게 화상 효과를 건다.",	},
        {	"장수특성" : "회심공격",	"설명" : "공격 시 무조건 회심 공격을 가한다.",	},
        {	"장수특성" : "회심공격강화",	"설명" : "회심 공격 시 위력이 더욱 증가한다.",	},
        {	"장수특성" : "회심공격면역",	"설명" : "적군의 회심 공격을 100% 방어한다. 단 방어 시 1의 피해량을 받으며 '협공 · 재반격 · 인도 공격 · 파진 공격 · 분전 공격 · 지원 공격' 시 발동하지 않는다.",	},
        {	"장수특성" : "후퇴공격",	"설명" : "물리 공격에 성공하면 피격자의 반대방향으로 2칸 이동한다. 이동할 수 없는 경우와 연속 공격의 첫 공격은 20%의 추가 피해가 발생한다.",	},
        {	"장수특성" : "흡혈공격",	"설명" : "물리 공격 시 피해의 n%를 본대의 HP로 흡수한다.",	},
        {	"장수특성" : "EP절약",	"설명" : "책략 사용 시 소모되는 EP의 양이 n%만큼 감소한다.",	},
        {	"장수특성" : "HP보조",	"설명" : "최대 HP가 n(%) 만큼 증가한다.",	},
        {	"장수특성" : "HP회복",	"설명" : "매 턴 최대 HP의 n% 만큼 HP가 회복된다.",	},
        {	"장수특성" : "MP공격",	"설명" : "물리 공격 시 잔여 MP의 양만큼 물리 피해량이 증가한다. 공격 후 잔여 MP가 10%만큼 감소한다.",	},
        {	"장수특성" : "MP방어",	"설명" : "물리 피격 시 HP 대신 MP를 소모한다. MP가 0이 되면 HP가 소모된다.",	},
        {	"장수특성" : "MP보조",	"설명" : "최대 MP가 n% 만큼 증가한다.",	},
        {	"장수특성" : "MP절약",	"설명" : "책략 사용 시 소모되는 MP의 양이 n% 만큼 감소한다.",	},
        {	"장수특성" : "MP회복",	"설명" : "매 턴 최대 MP의 n% 만큼 MP가 회복된다.",	},
        {	"장수특성" : "MP공격%",	"설명" : "물리 공격 시 잔여 MP의 50% 양만큼 물리 피해량이 증가한다. 공격 후 잔여 MP가 10% 만큼 감소한다.",	},


    ]
    
}

function getMongMemberInfoMap() {

    return {
        "학소" : [	"제갈량",	"강유",	"위연",	"왕평",	"마대",	"비의",	"",	"",	"",	"",	""],
        "강유" : [	"종회",	"등애",	"등충",	"호열",	"제갈서",	"두예",	"",	"",	"",	"",	""],
        "마남풍" : [	"특정장수트리거없음",	"",	"",	"",	"",	"",	"",	"",	"",	"",	""],
        "장각" : [	"조조",	"관우",	"장비",	"황보숭",	"아만",	"노식",	"유비",	"주준",	"손견",	"장각",	"엄정"],
        "동탁" : [	"유비",	"관우",	"장비",	"조조",	"여포",	"초선",	"동백",	"공손찬",	"원소",	"원술",	""],
        "원술" : [	"조조",	"유비",	"관우",	"장비",	"손견",	"손책",	"여포",	"여령기",	"",	"",	""],
        "원소" : [	"허유",	"전풍",	"저수",	"공손찬",	"장합",	"고람",	"조조",	"허저",	"관우",	"곽도",	"심배"],
        "엄백호" : [	"손책",	"허공",	"왕랑",	"",	"",	"",	"",	"",	"",	"",	""],
        "손권" : [	"만총",	"온회",	"이전",	"장료",	"장합",	"우금",	"서황",	"악진",	"주유",	"노숙",	""],
        "하후연" : [	"유비",	"장비",	"황충",	"엄안",	"법정",	"제갈량",	"마갈량",	"",	"",	"",	""],
        "조인" : [	"마량",	"관우",	"관평",	"조루",	"왕보",	"주창",	"미방",	"제갈량",	"",	"",	""],
        "맹획" : [	"제갈량",	"마갈량",	"관흥",	"장포",	"여개",	"마속",	"조운",	"위연",	"장억",	"오의",	"목록대왕"],

    }
}

function getPlaceList() {
    return [

        {	"이름" : "허창",	"우선도" : "5",	"군량시설" : "경작",	"은전시설" : "견직",	},
        {	"이름" : "성도",	"우선도" : "5",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "업",	"우선도" : "5",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "낙양",	"우선도" : "5",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "장안",	"우선도" : "5",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "양양",	"우선도" : "5",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "건업",	"우선도" : "5",	"군량시설" : "수산물",	"은전시설" : "항만",	},
        {	"이름" : "강주",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "견직",	},
        {	"이름" : "복양",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "오",	"우선도" : "4",	"군량시설" : "수산물",	"은전시설" : "항만",	},
        {	"이름" : "강릉",	"우선도" : "4",	"군량시설" : "수산물",	"은전시설" : "항만",	},
        {	"이름" : "수춘",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "시상",	"우선도" : "4",	"군량시설" : "수산물",	"은전시설" : "공방",	},
        {	"이름" : "한중",	"우선도" : "4",	"군량시설" : "양돈",	"은전시설" : "공방",	},
        {	"이름" : "운남",	"우선도" : "4",	"군량시설" : "과수",	"은전시설" : "시장",	},
        {	"이름" : "장사",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "남피",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "공방",	},
        {	"이름" : "강하",	"우선도" : "4",	"군량시설" : "수산물",	"은전시설" : "항만",	},
        {	"이름" : "북평",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "제재소",	},
        {	"이름" : "하비",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "무위",	"우선도" : "4",	"군량시설" : "과수",	"은전시설" : "제재소",	},
        {	"이름" : "영안",	"우선도" : "4",	"군량시설" : "수산물",	"은전시설" : "항만",	},
        {	"이름" : "교지",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "공방",	},
        {	"이름" : "무릉",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "강양",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "남해",	"우선도" : "4",	"군량시설" : "수산물",	"은전시설" : "항만",	},
        {	"이름" : "진류",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "서평",	"우선도" : "4",	"군량시설" : "과수",	"은전시설" : "제재소",	},
        {	"이름" : "하내",	"우선도" : "4",	"군량시설" : "과수",	"은전시설" : "시장",	},
        {	"이름" : "임해",	"우선도" : "4",	"군량시설" : "수산물",	"은전시설" : "항만",	},
        {	"이름" : "안정",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "제재소",	},
        {	"이름" : "천수",	"우선도" : "4",	"군량시설" : "과수",	"은전시설" : "견직",	},
        {	"이름" : "완",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "건안",	"우선도" : "4",	"군량시설" : "양돈",	"은전시설" : "시장",	},
        {	"이름" : "건녕",	"우선도" : "4",	"군량시설" : "과수",	"은전시설" : "시장",	},
        {	"이름" : "여남",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "공방",	},
        {	"이름" : "자동",	"우선도" : "4",	"군량시설" : "양돈",	"은전시설" : "공방",	},
        {	"이름" : "적도",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "남안",	"우선도" : "4",	"군량시설" : "경작",	"은전시설" : "제재소",	},
        {	"이름" : "여강",	"우선도" : "3",	"군량시설" : "수산물",	"은전시설" : "시장",	},
        {	"이름" : "회계",	"우선도" : "3",	"군량시설" : "수산물",	"은전시설" : "항만",	},
        {	"이름" : "팽성",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "견직",	},
        {	"이름" : "평원",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "창오",	"우선도" : "3",	"군량시설" : "수산물",	"은전시설" : "항만",	},
        {	"이름" : "합비",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "가정",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "계양",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "북해",	"우선도" : "3",	"군량시설" : "수산물",	"은전시설" : "시장",	},
        {	"이름" : "상용",	"우선도" : "3",	"군량시설" : "수산물",	"은전시설" : "견직",	},
        {	"이름" : "회음",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "흥고",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "남창",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "광릉",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "견직",	},
        {	"이름" : "계",	"우선도" : "3",	"군량시설" : "과수",	"은전시설" : "제재소",	},
        {	"이름" : "여릉",	"우선도" : "3",	"군량시설" : "과수",	"은전시설" : "시장",	},
        {	"이름" : "소패",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "견직",	},
        {	"이름" : "번성",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "상산",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "제재소",	},
        {	"이름" : "부춘",	"우선도" : "3",	"군량시설" : "과수",	"은전시설" : "시장",	},
        {	"이름" : "양평",	"우선도" : "3",	"군량시설" : "수산물",	"은전시설" : "제재소",	},
        {	"이름" : "상당",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "제재소",	},
        {	"이름" : "진양",	"우선도" : "3",	"군량시설" : "양돈",	"은전시설" : "제재소",	},
        {	"이름" : "영창",	"우선도" : "3",	"군량시설" : "과수",	"은전시설" : "시장",	},
        {	"이름" : "신야",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "견직",	},
        {	"이름" : "영릉",	"우선도" : "3",	"군량시설" : "과수",	"은전시설" : "시장",	},
        {	"이름" : "건평",	"우선도" : "3",	"군량시설" : "수산물",	"은전시설" : "시장",	},
        {	"이름" : "석정",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "기성",	"우선도" : "3",	"군량시설" : "양돈",	"은전시설" : "제재소",	},
        {	"이름" : "제남",	"우선도" : "3",	"군량시설" : "경작",	"은전시설" : "시장",	},
        {	"이름" : "역",	"우선도" : "3",	"군량시설" : "과수",	"은전시설" : "시장",	},

    ]
}

function getArmyList() {
    return [
        {	"병종구분":"방어대",	"병종":"책사",	"상위병종":"참모대",	"병종효과1":"받는피해감소(20)",	"병종효과2":"주는피해감소(20)",	"병종효과3":"",	"스킬" : [	"때리기",	"초열",	"진화",	"치료",	"",	"",	""]	},
        {	"병종구분":"방어대",	"병종":"보급대",	"상위병종":"풍수대",	"병종효과1":"받는피해감소(20)",	"병종효과2":"주는피해감소(20)",	"병종효과3":"",	"스킬" : [	"때리기",	"소보급",	"각성",	"진화",	"치료",	"",	""]	},
        {	"병종구분":"방어대",	"병종":"웅술사",	"상위병종":"상병",	"병종효과1":"받는피해감소(20)",	"병종효과2":"주는피해감소(20)",	"병종효과3":"",	"스킬" : [	"할퀴기",	"압박",	"저지",	"치료",	"",	"",	""]	},
        {	"병종구분":"방어대",	"병종":"보병",	"상위병종":"근위병",	"병종효과1":"받는피해감소(20)",	"병종효과2":"주는피해감소(20)",	"병종효과3":"",	"스킬" : [	"베기",	"기합",	"낙석",	"치료",	"",	"",	""]	},
        {	"병종구분":"방어대",	"병종":"참모대",	"상위병종":"",	"병종효과1":"받는피해감소(20)",	"병종효과2":"주는피해감소(20)",	"병종효과3":"",	"스킬" : [	"때리기",	"초열",	"화진",	"포박",	"진화",	"치료",	""]	},
        {	"병종구분":"방어대",	"병종":"풍수대",	"상위병종":"",	"병종효과1":"받는피해감소(20)",	"병종효과2":"주는피해감소(20)",	"병종효과3":"",	"스킬" : [	"때리기",	"소보급",	"구원대",	"각성",	"포박",	"진화",	"치료"]	},
        {	"병종구분":"방어대",	"병종":"상병",	"상위병종":"",	"병종효과1":"받는피해감소(20)",	"병종효과2":"주는피해감소(20)",	"병종효과3":"",	"스킬" : [	"돌진",	"압박",	"저지",	"허보",	"치료",	"",	""]	},
        {	"병종구분":"방어대",	"병종":"근위병",	"상위병종":"",	"병종효과1":"받는피해감소(20)",	"병종효과2":"주는피해감소(20)",	"병종효과3":"",	"스킬" : [	"베기",	"기합",	"낙석",	"호위",	"치료",	"",	""]	},
        {	"병종구분":"돌격대",	"병종":"강창병",	"상위병종":"중창병",	"병종효과1":"기마대공격강화(30)",	"병종효과2":"기마대공격방어(20)",	"병종효과3":"",	"스킬" : [	"찌르기",	"발목강타",	"돌파",	"견고",	"치료",	"",	""]	},
        {	"병종구분":"돌격대",	"병종":"수군",	"상위병종":"도독",	"병종효과1":"기마대공격강화(30)",	"병종효과2":"기마대공격방어(20)",	"병종효과3":"수전보조(10)",	"스킬" : [	"베기",	"발목강타",	"함대지휘",	"욕설",	"탁류",	"치료",	""]	},
        {	"병종구분":"돌격대",	"병종":"무인",	"상위병종":"투사",	"병종효과1":"기마대공격강화(30)",	"병종효과2":"기마대공격방어(20)",	"병종효과3":"",	"스킬" : [	"지르기",	"발목강타",	"독연",	"교란",	"치료",	"",	""]	},
        {	"병종구분":"돌격대",	"병종":"검사",	"상위병종":"검성",	"병종효과1":"기마대공격강화(30)",	"병종효과2":"기마대공격방어(20)",	"병종효과3":"",	"스킬" : [	"베기",	"발목강타",	"기합",	"강습",	"치료",	"",	""]	},
        {	"병종구분":"돌격대",	"병종":"중창병",	"상위병종":"",	"병종효과1":"기마대공격강화(30)",	"병종효과2":"기마대공격방어(20)",	"병종효과3":"공격범위증가(1)",	"스킬" : [	"찌르기",	"발목강타",	"돌파",	"견고",	"기합",	"치료",	""]	},
        {	"병종구분":"돌격대",	"병종":"도독",	"상위병종":"",	"병종효과1":"기마대공격강화(30)",	"병종효과2":"기마대공격방어(20)",	"병종효과3":"수전보조(10)",	"스킬" : [	"베기",	"발목강타",	"함대지휘",	"욕설",	"탁류",	"초열",	"치료"]	},
        {	"병종구분":"돌격대",	"병종":"투사",	"상위병종":"",	"병종효과1":"기마대공격강화(30)",	"병종효과2":"기마대공격방어(20)",	"병종효과3":"공격범위증가(1)",	"스킬" : [	"지르기",	"발목강타",	"독연",	"교란",	"둔병",	"치료",	""]	},
        {	"병종구분":"돌격대",	"병종":"검성",	"상위병종":"",	"병종효과1":"기마대공격강화(30)",	"병종효과2":"기마대공격방어(20)",	"병종효과3":"",	"스킬" : [	"베기",	"발목강타",	"기합",	"강습",	"관통",	"치료",	""]	},
        {	"병종구분":"기마대",	"병종":"중기병",	"상위병종":"신위대",	"병종효과1":"사격대공격강화(30)",	"병종효과2":"사격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"찌르기",	"돌격이동",	"견고",	"치료",	"",	"",	""]	},
        {	"병종구분":"기마대",	"병종":"전차",	"상위병종":"대전차",	"병종효과1":"사격대공격강화(30)",	"병종효과2":"사격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"찌르기",	"돌격이동",	"질주",	"치료",	"",	"",	""]	},
        {	"병종구분":"기마대",	"병종":"경기병",	"상위병종":"금위대",	"병종효과1":"사격대공격강화(30)",	"병종효과2":"사격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"찌르기",	"돌격이동",	"기합",	"치료",	"",	"",	""]	},
        {	"병종구분":"기마대",	"병종":"산악기병",	"상위병종":"결사대",	"병종효과1":"사격대공격강화(30)",	"병종효과2":"사격대공격방어(20)",	"병종효과3":"산지보조(10)",	"스킬" : [	"찌르기",	"돌격이동",	"갈퀴",	"치료",	"산지보조(10)",	"",	""]	},
        {	"병종구분":"기마대",	"병종":"신위대",	"상위병종":"",	"병종효과1":"사격대공격강화(30)",	"병종효과2":"사격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"찌르기",	"돌격이동",	"견고",	"난격",	"치료",	"",	""]	},
        {	"병종구분":"기마대",	"병종":"대전차",	"상위병종":"",	"병종효과1":"사격대공격강화(30)",	"병종효과2":"사격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"찌르기",	"돌격이동",	"질주",	"기합",	"치료",	"",	""]	},
        {	"병종구분":"기마대",	"병종":"금위대",	"상위병종":"",	"병종효과1":"사격대공격강화(30)",	"병종효과2":"사격대공격방어(20)",	"병종효과3":"산지보조(10)",	"스킬" : [	"찌르기",	"돌격이동",	"기합",	"연격",	"치료",	"",	""]	},
        {	"병종구분":"기마대",	"병종":"결사대",	"상위병종":"",	"병종효과1":"사격대공격강화(30)",	"병종효과2":"사격대공격방어(20)",	"병종효과3":"산지보조(10)",	"스킬" : [	"찌르기",	"돌격이동",	"갈퀴",	"포박",	"치료",	"",	""]	},
        {	"병종구분":"사격대",	"병종":"강궁병",	"상위병종":"궁장대",	"병종효과1":"돌격대공격강화(30)",	"병종효과2":"돌격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"사격",	"화시",	"기합",	"치료",	"",	"",	""]	},
        {	"병종구분":"사격대",	"병종":"연노병",	"상위병종":"원융노병",	"병종효과1":"돌격대공격강화(30)",	"병종효과2":"돌격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"사격",	"화시",	"연사",	"치료",	"",	"",	""]	},
        {	"병종구분":"사격대",	"병종":"궁기병",	"상위병종":"비사대",	"병종효과1":"돌격대공격강화(30)",	"병종효과2":"돌격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"사격",	"화시",	"강행",	"치료",	"",	"",	""]	},
        {	"병종구분":"사격대",	"병종":"노전차",	"상위병종":"비룡거",	"병종효과1":"돌격대공격강화(30)",	"병종효과2":"돌격대공격방어(20)",	"병종효과3":"산지보조(10)",	"스킬" : [	"사격",	"화시",	"질주",	"치료",	"",	"",	""]	},
        {	"병종구분":"사격대",	"병종":"궁장대",	"상위병종":"",	"병종효과1":"돌격대공격강화(30)",	"병종효과2":"돌격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"사격",	"화시",	"기합",	"선풍",	"치료",	"",	""]	},
        {	"병종구분":"사격대",	"병종":"원융노병",	"상위병종":"",	"병종효과1":"돌격대공격강화(30)",	"병종효과2":"돌격대공격방어(20)",	"병종효과3":"산지보조(10)",	"스킬" : [	"사격",	"화시",	"연사",	"난사",	"치료",	"",	""]	},
        {	"병종구분":"사격대",	"병종":"비사대",	"상위병종":"",	"병종효과1":"돌격대공격강화(30)",	"병종효과2":"돌격대공격방어(20)",	"병종효과3":"",	"스킬" : [	"사격",	"화시",	"강행",	"화살비",	"치료",	"",	""]	},
        {	"병종구분":"사격대",	"병종":"비룡거",	"상위병종":"",	"병종효과1":"돌격대공격강화(30)",	"병종효과2":"돌격대공격방어(20)",	"병종효과3":"산지보조(10)",	"스킬" : [	"사격",	"화시",	"질주",	"기합",	"치료",	"",	""]	},
        
    ];
}

function getArmySkillInfoMap() {
    return {
        "때리기" : "일반공격",
        "할퀴기" : "일반공격",
        "베기" : "일반공격",
        "돌진" : "일반공격",
        "찌르기" : "일반공격",
        "지르기" : "일반공격",
        "사격" : "일반공격",
        "초열" : "해당지역에 불바닥생성",
        "소보급" : "단일 대상 회복",
        "때리기" : "일반공격",
        "기합" : "공격력 증가",
        "발목강타" : "이동력1감소,이동대기시간 2초증가",
        "돌격이동" : "행동대기시간1초단축(평,초,황,다리)",
        "화시" : "해당지역 불바닥생성",
        "진화" : "해당지역주변 불바닥 제거",
        "각성" : "우호부대 상태이상 제거",
        "저지" : "이동력감소",
        "낙석" : "적대대상 데미지 (산지,잔도,황무지)",
        "화진" : "해당지역 주변에 불바닥 생성",
        "구원대" : "우호부대 주변 체력회복",
        "돌파" : "한칸 밀치고 본인도 이동",
        "함대지휘" : "행동대기시간1초단축(완류,습지)",
        "독연" : "적대대상 중독",
        "견고" : "방어력 증가",
        "질주" : "적대대상 관통해서 혼란",
        "갈퀴" : "적대대상 한칸 끌어들임",
        "연사" : "적대대상 연속공격",
        "강행" : "이동력증가",
        "치료" : "본인체력회복",
        "포박" : "이동불가",
        "허보" : "행동불가",
        "호위" : "본대주위 단일데미지 대신받음",
        "욕설" : "방어력 하강",
        "교란" : "적대대상 행동대기시간3초증가",
        "강습" : "해로운상태이상1개당30%추가피해",
        "난격" : "주위모든대상 피해",
        "연격" : "적대대상 연속공격",
        "선풍" : "적대대상 피해",
        "난사" : "공격대상 주위 모든적에게 피해",
        "화살비" : "적대대상 행동대기시간 3초증가",
        "탁류" : "적대대상 피해",
        "둔병" : "순발력감소",
        "관통" : "방어력감소",


    }
}

function find(list,fieldName,fieldValue,flgMember) {

    if (flgMember) {
        for (var i = 0 ; i < list.length ; i++) {
            if (list[i].별칭 == fieldValue) {
    
                return list[i]
            }
        }
    }
    for (var i = 0 ; i < list.length ; i++) {

        if (list[i][fieldName] == fieldValue) {
            if (flgMember) {
                if (list[i].별칭 == "") {
                    return list[i];
                }
            } else {
                return list[i];
            }
        }
    }
    return "";
}

function t(date) {

    var today = new Date();

    if (date != null) {

        today = date
    }
    var wk = today.getDay();
    var time = today.getHours();
    var min = today.getMinutes();

    var targetDate;

    var weight = 0;
    
    if (wk == 3 || wk == 6) {

        if (time > 23 || (time == 23 && min > 30)) {
            if (wk == 3) {

                targetDate = today.getTime() + (3 * 24 * 60 * 60 * 1000);

            } else {

                targetDate = today.getTime() + (4 * 24 * 60 * 60 * 1000);

            }
        }

    }

    if (targetDate == null) {

        while (wk != 3 && wk != 6) {
    
            weight ++;
    
            if (wk == 6) {
                wk = 0;
            } else {
                wk ++;
            }
        }

        targetDate = today.getTime() + (weight * 24 * 60 * 60 * 1000);
    }
    
    
    return getDateStr(new Date(targetDate));
}

function getDateStr(date) {
    return date.getFullYear()+"/"+((date.getMonth()+1)+"").zf(2)+"/"+(date.getDate()+"").zf(2);
}

String.prototype.string = function(len) {

    var s = "";
    i = 0 ;
    while (i++ < len) {
        s += this;
    }

    return s;
}
String.prototype.zf = function (len) {
    return "0".string(len - this.length) + this;
}

//DOC
//DESC:AAAA
//DATE:yyyymmdd
//MEMB:[AAA|abc|Y],[BBB|abc|Y],[CCC|ccc|N]
var YH = function(room, d) {

    var data = DataBase.getDataBase(room+"@YH"+d);

    this.comment = "";
    this.memberList = [];
    this.date = d;

    if (data != null) {
        
        var lineList = data.split(crlf);
        var line;
        for (var i = 0 ; i < lineList.length ; i++) {

            line = lineList[i];
        

            var lineArr = line.split(":");

            if (lineArr.length == 2) {

                if (lineArr[0] == "DESC") {
                    
                    this.comment = lineArr[1];
                } else if (lineArr[0] == "MEMB") {
                    var membs = lineArr[1].split(",");

                    for (var j = 0; j < membs.length ; j++) {
                        if (membs[j] != "") {
                            var infos = membs[j].replace("[","").replace("]","").split("|");
                            
                            this.addMember(infos[0],infos[1],infos[2]);
                       
                        }
                    }
                }
            }
        }
    }
}

YH.prototype.print = function () {
    //2019/02/02연합전 출석표
    //-기린멸망전
    //---참석인원 13명
    //솔왕국 : 기마대, 디스코드 가능
    //예린아씨 : 보급대, 디스코드 가능

    var rtnText = this.date+"연합전 출석표" + crlf;
    rtnText = rtnText + this.comment + crlf;
    rtnText = rtnText + "---참석인원 "+this.memberList.length+"명";
    var typeFlg = false;
    for (var i = 0 ; i < this.memberList.length ;i++) {
        var m = this.memberList[i];
        rtnText = rtnText + crlf + " "+ m.name;
        typeFlg = false

        if (m.type != "") {
            rtnText = rtnText + ": "+m.type;
            typeFlg = true;
        }

        if (m.flgDiscode == "가능") {
            rtnText = rtnText + (typeFlg ? ", " : ": ")+(m.flgDiscode == "가능" ? "디스코드 가능":"");
        }
        

    }

    return rtnText;
}

YH.prototype.addMember = function(n, t, d) {

    var createFlg = true;
    for (var i = 0 ; i < this.memberList.length ; i++) {
        
        if(this.memberList[i].name == n) {

            this.memberList[i] = {
                name : n,
                type : t,
                flgDiscode : d
        
            }
            createFlg = false;
        } 
    }

    if (createFlg) {

        this.memberList.push({
            name : n,
            type : t,
            flgDiscode : d
    
        })
    }
}

YH.prototype.removeMember = function(n) {

    var newList = [];

    for (var i = 0 ; i < this.memberList.length ; i++) {

        if (this.memberList[i].name != n) {
            newList.push(this.memberList[i]);
        }
    }

    this.memberList = newList;

}

//DOC
//DESC:AAAA
//DATE:yyyymmdd
//MEMB:[AAA|abc|Y],[BBB|abc|Y],[CCC|ccc|N]
YH.prototype.save = function(room) {
    
    var data = "DESC:"+this.comment + crlf;
    data = data + "DATE:" + this.date + crlf;
    data = data + "MEMB:";

    var memb = "";
    for (var i = 0 ; i < this.memberList.length ; i++) {

        if (memb != "") {
            memb = memb + ",";
        }

        memb = memb + "["+this.memberList[i].name+"|"+this.memberList[i].type+"|"+this.memberList[i].flgDiscode+"]";
    }

    data = data + memb;

    DataBase.setDataBase(room+"@YH"+this.date, data);
}