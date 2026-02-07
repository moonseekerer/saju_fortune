let currentPillars = null;
let pendingData = null;
let lastResultData = null;
let adShown = false;

// --- 🔒 보안 설정: 우클릭 및 개발자 도구 접근 제한 ---
document.addEventListener('contextmenu', e => e.preventDefault()); // 우클릭 방지
document.addEventListener('keydown', e => {
    // F12, Ctrl+Shift+I/J/C, Ctrl+U 방지
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')) {
        e.preventDefault();
        return false;
    }
});

const TRANSLATIONS = {
    ko: {
        app_title: "2026년 나의 사주",
        app_desc: "생년월일을 입력하면 당신의 사주를 분석해드립니다.",
        label_name: "이름 또는 닉네임 (선택)",
        placeholder_name: "예 : 홍길동",
        label_gender: "성별",
        gender_male: "남성",
        gender_female: "여성",
        label_year: "생년",
        placeholder_year: "1990",
        label_month: "월",
        label_day: "일",
        label_time: "태어난 시간",
        select_default: "선택",
        time_unknown: "모름",
        time_0: "자시 (23:30 ~ 01:29)",
        time_1: "축시 (01:30 ~ 03:29)",
        time_2: "인시 (03:30 ~ 05:29)",
        time_3: "묘시 (05:30 ~ 07:29)",
        time_4: "진시 (07:30 ~ 09:29)",
        time_5: "사시 (09:30 ~ 11:29)",
        time_6: "오시 (11:30 ~ 13:29)",
        time_7: "미시 (13:30 ~ 15:29)",
        time_8: "신시 (15:30 ~ 17:29)",
        time_9: "유시 (17:30 ~ 19:29)",
        time_10: "술시 (19:30 ~ 21:29)",
        time_11: "해시 (21:30 ~ 23:29)",
        privacy_agree: "개인정보 수집 및 이용 동의 (필수)",
        privacy_details: "자세히 보기",
        privacy_details_hide: "간략히",
        privacy_content: "• 수집 목적: 사주 분석 결과 제공 및 서비스 이용 통계 분석<br>• 수집 항목: 이름(또는 닉네임, 선택), 생년월일, 성별, 태어난 시간<br>• 보유 기간: 3년 (통계 분석 목적, 개인 식별 정보 비식별화 처리)<br><strong>* 이름/닉네임은 선택사항이며, 입력하지 않아도 분석이 가능합니다.</strong><br><strong>* 실명 대신 닉네임 사용을 권장합니다.</strong><br>* 동의를 거부할 권리가 있으며, 거부 시 서비스 이용이 제한됩니다.<br><br><strong>❓ 닉네임으로 적어도 괜찮은가요?</strong><br>네, 본 서비스는 이름의 획수를 보는 성명학이 아닌 태어난 날짜 기운을 분석하는 명리학을 기반으로 합니다. 닉네임을 사용하셔도 분석 결과에는 아무런 영향이 없으니 안심하세요!",
        btn_submit: "분석 시작하기 ✨",
        share_test_title: "친구에게 테스트 공유하기",
        share_test_desc: "2026년 운세를 무료로 확인해보세요",
        lunar_converter_title: "음력/양력 변환기",
        lunar_converter_desc: "생년월일을 음력↔양력으로 변환하세요",
        history_title: "최근 분석 기록",
        history_desc: "이전에 분석한 사주를 다시 확인하세요",
        history_modal_title: "📜 최근 분석 기록",
        history_empty: "기록이 없습니다.",
        history_date: "분석일: ",
        loading_msg: "사주를 분석하고 있습니다...",
        ad_title: "🎁 잠깐! 오늘의 운세 아이템을 확인해보세요",
        ad_desc: "👇 이 링크를 클릭해주시면<br>제작자에게 큰 도움이 됩니다 🙇‍♂️",
        ad_disclaimer: "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.",
        ad_wait_msg: "초 후에 결과를 볼 수 있습니다",
        btn_wait: "기다리는 중...",
        btn_view_result: "결과 보기 ✨",
        btn_back: "← 다시 입력하기",
        analysis_report: "Analysis Report",
        tab_hour: "시주", tab_hour_sub: "말년/자식",
        tab_day: "일주(나)", tab_day_sub: "본원/배우자",
        tab_month: "월주", tab_month_sub: "사회/부모",
        tab_year: "년주", tab_year_sub: "초년/조상",
        card_nature: "🧙 타고난 기질",
        card_fortune: "🌟 2026년 운세 미리보기",
        subtab_love: "💕 연애운",
        subtab_wealth: "💰 재물운",
        subtab_health: "🏥 건강운",
        subtab_study: "📚 학업운",
        card_love: "💕 나의 연애 스타일",
        card_wealth: "💰 나의 재물 그릇",
        card_health: "🏥 나의 건강 관리",
        card_study: "📚 나의 학습 스타일",
        ohaeng_title: "☯️ 오행 분포 (에너지 균형)",
        ohaeng_scaling_title: "🧐 오행 분포는 어떻게 계산되나요?",
        ohaeng_desc: "<p>사주(四柱)는 태어난 년, 월, 일, 시를 일컫는 4개의 기둥이며, 각 기둥은 위(천간)와 아래(지지) 두 글자로 이루어져 총 <strong>8글자(팔자)</strong>가 됩니다.</p><ul><li><strong>분석 방식:</strong> 이 8글자 각각이 가진 고유한 오행(나무, 불, 흙, 쇠, 물) 성질을 모두 분석합니다.</li><li><strong>그래프 의미:</strong> 오각형 그래프는 나를 구성하는 8가지 기운의 분포를 보여줍니다.</li><li><strong>균형의 중요성:</strong> 어떤 기운이 많고 적음에 따라 개인의 성정이나 건강, 운의 흐름이 달라집니다. 골고루 분포되어 있을수록 기운이 조화롭다고 봅니다.</li></ul>",
        share_result_title: "내 결과 친구에게 공유하기",
        share_result_desc: "친구들은 어떤 사주를 가지고 있을까요? 👀",
        footer_ad: "🙇‍♂️ 아래 링크 클릭은<br>개발자에게 큰 힘이 됩니다!",
        footer_disclaimer: "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.",
        alert_privacy: "개인정보 수집 및 이용에 동의해야 분석이 가능합니다.",
        toast_copy: "링크가 복사되었습니다! 📋",
        toast_share_fail: "공유하기 실패 😢",
        toast_share_unsupported: "이 브라우저에서는 공유 기능을 지원하지 않습니다.",
        btn_lang: "🇰🇷 KO"
    },
    en: {
        app_title: "2026 Fortune Analysis",
        app_desc: "Enter your birth date to analyze your Saju (destiny).",
        label_name: "Name or Nickname (Optional)",
        placeholder_name: "e.g. John Doe",
        label_gender: "Gender",
        gender_male: "Male",
        gender_female: "Female",
        label_year: "Birth Year",
        placeholder_year: "1990",
        label_month: "Month",
        label_day: "Day",
        label_time: "Birth Time",
        select_default: "Select",
        time_unknown: "Unknown",
        time_0: "Rat (23:30 ~ 01:29)",
        time_1: "Ox (01:30 ~ 03:29)",
        time_2: "Tiger (03:30 ~ 05:29)",
        time_3: "Rabbit (05:30 ~ 07:29)",
        time_4: "Dragon (07:30 ~ 09:29)",
        time_5: "Snake (09:30 ~ 11:29)",
        time_6: "Horse (11:30 ~ 13:29)",
        time_7: "Sheep (13:30 ~ 15:29)",
        time_8: "Monkey (15:30 ~ 17:29)",
        time_9: "Rooster (17:30 ~ 19:29)",
        time_10: "Dog (19:30 ~ 21:29)",
        time_11: "Pig (21:30 ~ 23:29)",
        privacy_agree: "Agree to Privacy Policy (Required)",
        privacy_details: "View Details",
        privacy_details_hide: "Hide Details",
        privacy_content: "• Purpose: Provide Saju analysis and usage statistics<br>• Items: Name (or Nickname, Optional), Date of Birth, Gender, Birth Time<br>• Retention: 3 years for statistical analysis (Personally identifiable information is anonymized)<br><strong>* Name/Nickname is optional. You can proceed without entering it.</strong><br><strong>* Nickname is recommended over real name.</strong><br>* You have the right to refuse, but service will be limited.<br><br><strong>❓ Is it okay to use a nickname?</strong><br>Yes! This service is based on Saju (Four Pillars), which analyzes the energy of your birth date, not Name Analysis. Using a nickname does not affect the result at all!",
        btn_submit: "Start Analysis ✨",
        share_test_title: "Share with Friends",
        share_test_desc: "Check your 2026 fortune for free",
        lunar_converter_title: "Lunar/Solar Converter",
        lunar_converter_desc: "Convert birth date between Lunar↔Solar",
        history_title: "Recent History",
        history_desc: "Check your previous Saju results",
        history_modal_title: "📜 Recent Analysis",
        history_empty: "No records found.",
        history_date: "Result on: ",
        loading_msg: "Analyzing your destiny...",
        ad_title: "🎁 Wait! Check out today's lucky item",
        ad_desc: "👇 Clicking this link<br>is a great help to the developer 🙇‍♂️",
        ad_disclaimer: "This post is part of Coupang Partners activity, and we receive a small commission.",
        ad_wait_msg: "seconds to see results",
        btn_wait: "Waiting...",
        btn_view_result: "View Result ✨",
        btn_back: "← Enter Again",
        analysis_report: "Analysis Report",
        tab_hour: "Hour Pillar", tab_hour_sub: "Late Life/Children",
        tab_day: "Day Pillar", tab_day_sub: "Self/Spouse",
        tab_month: "Month Pillar", tab_month_sub: "Society/Parents",
        tab_year: "Year Pillar", tab_year_sub: "Early Life/Ancestors",
        card_nature: "🧙 Innate Nature",
        card_fortune: "🌟 2026 Fortune Preview",
        subtab_love: "💕 Love",
        subtab_wealth: "💰 Wealth",
        subtab_health: "🏥 Health",
        subtab_study: "📚 Study",
        card_love: "💕 My Love Style",
        card_wealth: "💰 My Wealth Pot",
        card_health: "🏥 My Health Care",
        card_study: "📚 My Study Style",
        ohaeng_title: "☯️ 5 Elements Distribution",
        ohaeng_scaling_title: "🧐 How is it calculated?",
        ohaeng_desc: "<p>Saju (Four Pillars) consists of 4 pillars representing Year, Month, Day, and Hour. Each pillar has a Heaven (top) and Earth (bottom) character, totaling <strong>8 characters</strong>.</p><ul><li><strong>Analysis:</strong> We analyze the Five Elements (Wood, Fire, Earth, Metal, Water) of these 8 characters.</li><li><strong>Graph:</strong> The chart shows the distribution of your energy.</li><li><strong>Balance:</strong> The balance of these elements influences your personality, health, and fortune. A balanced distribution is considered harmonious.</li></ul>",
        share_result_title: "Share My Result",
        share_result_desc: "What destiny do your friends have? 👀",
        footer_ad: "🙇‍♂️ Clicking the link below<br>is a big support for the developer!",
        footer_disclaimer: "This post is part of Coupang Partners activity, and we receive a small commission.",
        alert_privacy: "You must agree to the Privacy Policy to proceed.",
        toast_copy: "Link copied to clipboard! 📋",
        toast_share_fail: "Sharing failed 😢",
        toast_share_unsupported: "Web Share API not supported on this browser.",
        btn_lang: "🇺🇸 EN"
    }
};

let currentLang = 'ko';

function toggleLanguage() {
    const newLang = currentLang === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
}

function setLanguage(lang) {
    currentLang = lang;

    // Update Toggle Button Text/Icon
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.textContent = lang === 'ko' ? "🇰🇷" : "🇺🇸"; // Or use emoji flag directly if preferred
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (TRANSLATIONS[lang][key]) {
            if (el.tagName === 'INPUT' && el.placeholder) {
                el.placeholder = TRANSLATIONS[lang][key];
            } else {
                el.innerHTML = TRANSLATIONS[lang][key];
            }
        }
    });

    // Update select default option
    const selects = document.querySelectorAll('select');
    selects.forEach(s => {
        if (s.options[0].value === "") {
            s.options[0].text = TRANSLATIONS[lang].select_default;
        }
    });

    // Refresh Result if visible
    if (document.getElementById('result-screen').style.display === 'block') {
        if (typeof updateResultTexts === 'function') updateResultTexts();
    }


    populateDateOptions();
}

// Add event listener for privacy details toggle
document.addEventListener('DOMContentLoaded', () => {
    const privacyDetails = document.querySelector('.privacy-details');
    if (privacyDetails) {
        privacyDetails.addEventListener('toggle', function () {
            const summary = this.querySelector('summary');
            if (summary) {
                if (this.open) {
                    summary.textContent = TRANSLATIONS[currentLang].privacy_details_hide;
                } else {
                    summary.textContent = TRANSLATIONS[currentLang].privacy_details;
                }
            }
        });
    }
});

function populateDateOptions() {
    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');
    const daySelect = document.getElementById('birthDay');

    if (!yearSelect || !monthSelect || !daySelect) return;

    const selectedYear = parseInt(yearSelect.value);
    const selectedMonth = parseInt(monthSelect.value);
    const selectedDay = parseInt(daySelect.value);

    // Populate Month Options
    const currentMonthVal = monthSelect.value;
    monthSelect.innerHTML = `<option value="" data-i18n="select_default">${TRANSLATIONS[currentLang].select_default}</option>`;
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = currentLang === 'en' ? `${i}` : `${i}월`;
        if (i === parseInt(currentMonthVal)) option.selected = true;
        monthSelect.appendChild(option);
    }

    // Populate Day Options based on Year and Month
    let daysInMonth = 31;
    if (selectedMonth === 4 || selectedMonth === 6 || selectedMonth === 9 || selectedMonth === 11) {
        daysInMonth = 30;
    } else if (selectedMonth === 2) {
        const isLeap = (selectedYear % 4 === 0 && selectedYear % 100 !== 0) || (selectedYear % 400 === 0);
        daysInMonth = isLeap ? 29 : 28;
    }

    const currentDayVal = daySelect.value;
    daySelect.innerHTML = `<option value="" data-i18n="select_default">${TRANSLATIONS[currentLang].select_default}</option>`;
    for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = currentLang === 'en' ? `${i}` : `${i}일`;
        if (i === parseInt(currentDayVal)) option.selected = true;
        daySelect.appendChild(option);
    }
}

// Event Listeners for Date Changes
document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');

    if (yearSelect && monthSelect) {
        yearSelect.addEventListener('change', populateDateOptions);
        monthSelect.addEventListener('change', populateDateOptions);
    }
    populateDateOptions(); // Initial population

    // Set validation messages
    const requiredInputs = document.querySelectorAll('select[required], input[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('invalid', function () {
            if (this.value === "") {
                const msg = currentLang === 'en' ? "Please select an item in the list." : "목록에서 항목을 선택하세요.";
                this.setCustomValidity(msg);
            }
        });
        input.addEventListener('input', function () {
            this.setCustomValidity("");
        });
    });
});

const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const stemReadings = { "甲": "갑", "乙": "을", "丙": "병", "丁": "정", "戊": "무", "己": "기", "庚": "경", "辛": "신", "壬": "임", "癸": "계" };
const branchReadings = { "子": "자", "丑": "축", "寅": "인", "卯": "묘", "辰": "진", "巳": "사", "午": "오", "未": "미", "申": "신", "酉": "유", "戌": "술", "亥": "해" };

function getColorClass(char) {
    if ("甲乙寅卯".includes(char)) return "wood";
    if ("丙丁巳午".includes(char)) return "fire";
    if ("戊己辰戌丑未".includes(char)) return "earth";
    if ("庚辛申酉".includes(char)) return "metal";
    if ("壬癸亥子".includes(char)) return "water";
    return "";
}

const loveMapMale = {
    "甲": "당신에게 연애는 '지켜야 할 소중한 꽃'과 같습니다. 겉으로는 무뚝뚝해 보여도 내 사람이라 생각되면 든든한 그늘이 되어주는 믿음직한 타입입니다. <br><br>좋고 싫음이 분명하여 밀당을 하기보다는 직설적으로 감정을 표현하는 편입니다. 한번 마음을 주면 아낌없이 주는 나무처럼 헌신하지만, 자존심을 건드리는 상대에게는 차갑게 변할 수 있습니다. <br><br><strong>💡 연애 팁:</strong> 상대방에게 의지하기보다는 듬직하게 이끌어주기를 원하며, 존경할 수 있는 배울 점이 많은 사람에게 끌립니다. 가끔은 부드러운 말 한마디가 관계를 더욱 돈독하게 만듭니다.",
    "乙": "섬세하고 다정한 연인입니다. 상대방의 미묘한 감정 변화까지 잘 알아차리고 맞춰주는 배려심이 뛰어납니다. 친구 같은 편안함을 주면서도 은근한 애정 표현으로 상대의 마음을 사로잡습니다. <br><br>하지만 겉으로는 유순해 보여도 속으로는 질투심과 소유욕이 강한 편입니다. 사랑을 확인받고 싶어 하는 욕구가 크며, 관계에 대한 불안감이 집착으로 변질되지 않도록 주의가 필요합니다. <br><br><strong>💡 연애 팁:</strong> 너무 의존적이 되기보다는 자신만의 취미나 관심사를 유지하며 독립적인 매력을 키우는 것이 좋습니다. 끈기 있게 관계를 이어가는 힘이 있어 어려움이 닥쳐도 쉽게 포기하지 않습니다.",
    "丙": "열정적이고 화끈한 사랑을 합니다. 한눈에 반하는 '금사빠' 기질이 있으며 애정 표현에 거침이 없습니다. 화려하고 적극적인 구애로 상대를 단번에 사로잡는 매력이 있습니다. <br><br>하지만 불같이 타오르는 만큼 금방 식어버릴 수 있어 장기적인 관계 유지에 노력이 필요합니다. 욱하는 성질 때문에 다툼이 잦을 수 있으니 감정 조절이 중요합니다. <br><br><strong>💡 연애 팁:</strong> 뒤끝 없이 쿨한 연애를 지향하지만, 은근한 정을 키우는 노력이 필요합니다. 밝고 명랑한 에너지로 연인을 즐겁게 해주는 분위기 메이커입니다. 상대방의 이야기를 경청하는 시간을 가지면 관계가 더욱 깊어집니다.",
    "丁": "조용히 타오르는 등불 같은 사랑을 합니다. 첫눈에 반하기보다는 시간을 두고 천천히 스며드는 연애를 선호합니다. 상대방의 사소한 습관이나 취향까지 기억하는 세심함이 있습니다. <br><br>한번 마음을 주면 웬만해서는 변치 않는 일편단심형입니다. 하지만 상처를 받으면 겉으로 내색하지 않고 속으로 끙끙 앓거나 오랫동안 꽁해 있을 수 있습니다. <br><br><strong>💡 연애 팁:</strong> 감정을 속으로만 삭이지 말고 대화로 풀어나가는 습관을 들이세요. 따뜻한 배려심과 헌신적인 모습으로 상대의 모성애/부성애를 자극하는 매력이 있습니다. 조용하지만 깊은 사랑을 나눌 수 있는 타입입니다.",
    "戊": "믿음직스러운 바위 같은 연인입니다. 애교를 부리거나 달콤한 말을 하는 데는 서툴지만, 행동으로 보여주는 든든함이 있습니다. 포용력이 넓어 연인의 투정을 잘 받아주며, 가벼운 만남보다는 결혼을 전제로 한 진지한 만남을 선호합니다. <br><br>하지만 변화를 싫어하고 고집이 세서, 한번 다투면 좀처럼 먼저 굽히지 않아 답답함을 줄 수도 있습니다. <br><br><strong>💡 연애 팁:</strong> 무뚝뚝함 때문에 오해를 살 수 있으니 가끔은 달콤한 말 한마디나 작은 선물로 마음을 표현하세요. 안정적이고 책임감 있는 모습으로 상대에게 큰 신뢰를 줍니다.",
    "己": "포용력 있는 대지 같은 사랑을 합니다. 상대방의 단점까지 안아주려 노력하며 알뜰살뜰 챙겨주는 스타일입니다. 드라마 같은 로맨스보다는 서로에게 도움이 되고 실속 있는 관계를 중요하게 생각합니다. <br><br>현실적인 안정감을 중시하며 가족 같은 편안함을 주는 연애를 합니다. 의심이 많아 마음을 여는 데 시간이 걸리지만, 한번 깊어지면 끈끈한 사이가 됩니다. <br><br><strong>💡 연애 팁:</strong> 마음속으로 이해득실을 계산하는 면이 있으니, 때로는 손해를 보더라도 마음을 여는 것이 관계에 도움이 됩니다. 상대를 편안하게 만드는 능력이 뛰어납니다.",
    "庚": "카리스마 있는 리더형 연인입니다. 맺고 끊음이 확실하여 어장관리를 하거나 애매한 태도를 보이는 것을 극도로 싫어합니다. 내 사람에게는 확실하게 책임을 지는 상남자 스타일입니다. <br><br>의리와 신의를 중요시하며 카리스마 있게 상대를 리드합니다. 다만 자기주장이 너무 강하고 무뚝뚝하여 상대방이 상처받을 수 있습니다. <br><br><strong>💡 연애 팁:</strong> 고집을 조금 꺾고 부드러운 대화법을 익히면 관계가 훨씬 부드러워집니다. 강한 추진력과 결단력으로 상대에게 든든함을 주지만, 때로는 상대의 의견을 경청하는 자세가 필요합니다.",
    "辛": "섬세한 취향을 가진 로맨티스트입니다. 외모나 스타일, 매너 등 자신만의 확고한 기준이 있어 눈이 높은 편입니다. 깔끔하고 세련된 데이트를 선호하며 분위기에 약한 감성파입니다. <br><br>예민한 감수성 때문에 사소한 말 한마디에도 쉽게 상처받을 수 있으며, 냉정하게 돌아설 때는 그 누구보다 차갑습니다. <br><br><strong>💡 연애 팁:</strong> 예민함을 예술적으로 승화시키면 연애가 즐겁습니다. 자신을 빛나게 해주고 세심하게 배려해주는 사람에게 끌립니다. 완벽주의 성향을 조금 내려놓으면 더 편안한 관계를 만들 수 있습니다.",
    "壬": "바다처럼 넓은 마음을 가진 자유로운 영혼입니다. 구속받는 것을 죽기보다 싫어하며, 서로의 사생활을 존중해 주는 쿨한 관계를 원합니다. 육체적인 매력보다는 정신적인 교감이나 대화가 통하는 것을 더 중요하게 생각합니다. <br><br>유머 감각이 있고 임기응변이 뛰어나 이성에게 인기가 많지만, 속마음을 다 보여주지 않아 '나쁜 남자' 같다는 오해를 사기도 합니다. <br><br><strong>💡 연애 팁:</strong> 신비로운 매력이 있지만 가끔은 진심을 보여주는 것도 필요합니다. 해외 운이 있어 국제 연애나 여행 중 만난 인연과 잘 맞을 수 있습니다.",
    "癸": "다정다감하고 감성적인 연애를 합니다. 애교가 많고 상냥하며, 상대방의 기분을 귀신같이 파악하여 맞춰주는 센스가 있습니다. 보호 본능을 자극하는 묘한 매력의 소유자입니다. <br><br>하지만 마음이 여려 상처를 잘 받고, 감정 기복이 심해 연인을 당황하게 만들기도 합니다. 상대방에게 의존하려는 경향이 있으며, 사랑을 확인함으로써 불안감을 해소하려 합니다. <br><br><strong>💡 연애 팁:</strong> 감정 기복을 잘 다스리면 최고의 연인이 됩니다. 섬세하게 상대를 챙겨주는 모습이 매력적이지만, 자신의 감정도 솔직하게 표현하는 것이 중요합니다."
};

const loveMapFemale = {
    "甲": "본받을 점이 있는 당당한 사람에게 끌립니다. 자신이 주도권을 쥐거나 독특한 매력으로 상대를 사로잡는 스타일입니다. 자립심이 강해 의존적인 관계는 지양하는 편입니다. <br><br>곧게 뻗은 나무처럼 자존심이 강하고 주관이 뚜렷합니다. 상대방에게 끌려다니기보다는 서로 존중하는 평등한 관계를 원합니다. <br><br><strong>💡 연애 팁:</strong> 강한 카리스마가 매력적이지만, 가끔은 부드러운 모습을 보여주는 것도 관계에 도움이 됩니다. 능력 있고 자신감 넘치는 모습으로 상대를 이끌어가는 커리어우먼 스타일입니다.",
    "乙": "넝쿨처럼 사랑을 확인받고 싶어 하는 욕구가 큽니다. 보호 본능을 자극하며 상대방에게 사랑받는 느낌을 중요하게 생각합니다. 섬세하고 다정한 매력으로 상대의 마음을 사로잡습니다. <br><br>겉으로는 유순해 보이지만 속으로는 질투심이 강한 편입니다. 사랑하는 사람에게 전적으로 헌신하지만, 그만큼 상대의 관심과 애정을 갈구합니다. <br><br><strong>💡 연애 팁:</strong> 집착을 경계하면 훨씬 아름다운 사랑을 합니다. 자신만의 취미와 관심사를 유지하며 독립적인 면모를 보여주면 관계가 더욱 건강해집니다. 끈기 있게 사랑을 지켜나가는 힘이 있습니다.",
    "丙": "태양처럼 밝고 명랑한 연애를 합니다. 인기가 많고 화려한 분위기를 즐기며 솔직하게 감정을 표현합니다. 적극적이고 당당한 모습으로 상대를 사로잡는 매력이 있습니다. <br><br>열정적이고 화끈한 성격으로 한눈에 반하는 경우가 많습니다. 하지만 감정이 격해질 때 욱하는 성질이 있어 다툼이 잦을 수 있습니다. <br><br><strong>💡 연애 팁:</strong> 가끔은 성질을 죽이고 상대의 말에 귀 기울이는 시간이 필요합니다. 밝은 에너지로 주변을 즐겁게 만드는 분위기 메이커입니다. 뒤끝 없이 쿨한 연애를 지향합니다.",
    "丁": "밤하늘의 달빛처럼 우아하고 신비로운 매력을 풍깁니다. 조용히 내조하거나 챙겨주는 것에 기쁨을 느끼며, 상대방의 사소한 것까지 세심하게 배려합니다. <br><br>한번 마음을 주면 변치 않는 일편단심형이 많습니다. 깊은 헌신과 따뜻한 마음으로 상대를 감싸 안습니다. 하지만 상처를 받으면 오래 마음에 담아두는 경향이 있습니다. <br><br><strong>💡 연애 팁:</strong> 감정을 속으로만 삭이지 말고 솔직하게 표현하는 것이 중요합니다. 은은하지만 깊은 사랑으로 상대의 마음을 녹이는 능력이 있습니다. 조용한 카리스마가 매력적입니다.",
    "戊": "듬직하고 안정감을 주는 상대를 원합니다. 가벼운 만남보다는 결혼까지 생각하는 진중한 연애가 어울립니다. 포용력이 넓어 상대의 단점까지 감싸 안으려 노력합니다. <br><br>믿음직스럽고 현실적인 감각이 뛰어나 배우자로서 최고의 자질을 갖췄습니다. 하지만 고집이 세고 변화를 싫어하는 면이 있습니다. <br><br><strong>💡 연애 팁:</strong> 자신의 고집을 조금 꺾으면 관계가 훨씬 부드러워집니다. 안정적이고 책임감 있는 모습으로 상대에게 큰 신뢰를 줍니다. 가족 같은 편안함을 주는 연애 스타일입니다.",
    "己": "알뜰살뜰 챙겨주는 엄마 같은 연인입니다. 현실적인 감각이 뛰어나 배우자로서 최고의 자질을 가졌습니다. 상대방의 필요를 미리 파악하고 세심하게 준비하는 능력이 있습니다. <br><br>실속 있는 관계를 중요하게 생각하며, 서로에게 도움이 되는 파트너십을 추구합니다. 의심이 많아 마음을 여는 데 시간이 걸리지만, 한번 깊어지면 끈끈한 사이가 됩니다. <br><br><strong>💡 연애 팁:</strong> 너무 잔소리가 많아지지 않도록 주의하면 좋습니다. 꼼꼼하고 알뜰한 성격으로 안정적인 가정을 꾸리는 데 탁월합니다. 상대를 편안하게 만드는 능력이 뛰어납니다.",
    "庚": "강하고 카리스마 있는 리더 스타일입니다. 내 사람을 지키는 힘이 대단하며 의리 있는 연애를 합니다. 맺고 끊음이 확실하여 애매한 관계를 싫어합니다. <br><br>결단력이 있고 추진력이 강해 상대를 이끌어가는 여장부 스타일입니다. 하지만 자기주장이 강해 갈등이 생길 수 있습니다. <br><br><strong>💡 연애 팁:</strong> 무뚝뚝함 속에 숨은 따뜻한 정을 보여주는 것이 핵심입니다. 강한 카리스마가 매력적이지만, 때로는 부드러운 대화법이 필요합니다. 책임감 있고 의리 있는 모습으로 상대에게 큰 신뢰를 줍니다.",
    "辛": "빛나는 보석처럼 자존감이 높고 우아합니다. 자신을 소중하게 대우해 주는 상대를 선호하며 보는 눈이 높습니다. 깔끔하고 세련된 것을 추구하며 분위기에 약한 로맨티스트입니다. <br><br>외모나 스타일, 매너 등 자신만의 확고한 기준이 있습니다. 예민한 감수성 때문에 사소한 말에도 쉽게 상처받을 수 있습니다. <br><br><strong>💡 연애 팁:</strong> 예민한 감수성을 공감해 주는 파트너가 필요합니다. 완벽주의 성향을 조금 내려놓으면 더 편안한 관계를 만들 수 있습니다. 자신을 빛나게 해주는 사람에게 끌립니다.",
    "壬": "지혜롭고 통찰력이 뛰어난 연애를 합니다. 얽매이기보다 자유로운 영혼을 가진 상대와 잘 맞습니다. 정신적인 교감과 대화가 통하는 것을 중요하게 생각합니다. <br><br>넓은 마음과 포용력으로 상대를 이해하며, 구속하지 않는 쿨한 관계를 선호합니다. 유머 감각이 있고 사교성이 좋아 인기가 많습니다. <br><br><strong>💡 연애 팁:</strong> 해외 운이나 여행을 통해 운명의 상대를 만날 확률이 높습니다. 신비로운 매력이 있지만 가끔은 진심을 보여주는 것도 필요합니다. 스케일 큰 사랑을 추구합니다.",
    "癸": "봄비처럼 촉촉하게 스며드는 다정한 사랑을 합니다. 모성애가 강해 상대를 잘 챙기지만 본인도 아이처럼 사랑받고 싶어 합니다. 애교가 많고 상냥하며 감성적입니다. <br><br>상대방의 기분을 귀신같이 파악하여 맞춰주는 센스가 있습니다. 하지만 감정 기복이 심하고 마음이 여려 상처를 잘 받습니다. <br><br><strong>💡 연애 팁:</strong> 정서적 교감이 가장 중요합니다. 감정 기복을 잘 다스리면 최고의 연인이 됩니다. 보호 본능을 자극하는 묘한 매력으로 상대의 마음을 사로잡습니다. 섬세하고 따뜻한 사랑을 나눌 수 있는 타입입니다."
};

const natureMapMale = {
    "甲": "당신은 곧게 뻗은 대림목(큰 나무)과 같습니다. 뿌리가 깊고 기둥이 튼튼하여 어지간한 비바람에도 흔들리지 않는 강인한 멘탈을 소유하고 있습니다. <br><br>겉으로는 무뚝뚝해 보일 수 있지만, 속에는 그 누구보다 강한 '성장 욕구'와 '자존심'이 꿈틀대고 있습니다. 남의 밑에서 지시받는 것을 좋아하지 않으며, 본인이 주도하여 결정을 내릴 때 가장 큰 능력을 발휘합니다. <br><br>리더십이 뛰어나고 책임감이 강해서, 한번 맡은 일은 끝까지 해내는 뚝심이 있습니다. 다만, 때로는 너무 융통성이 없어 '대나무' 같다는 평을 들을 수도 있으니 적당히 휘어지는 지혜도 필요합니다. 정의롭고 원칙을 중시하는 상남자 스타일입니다.",
    "乙": "당신은 끈질긴 생명력을 지닌 넝쿨 식물입니다. 화려한 장미 덩굴일 수도 있고, 척박한 땅에서도 살아남는 잡초일 수도 있습니다. 겉모습은 부드럽고 유연해 보이지만, 내면은 그 어떤 바위도 뚫고 나오는 무서운 집념을 가지고 있습니다. <br><br>환경 적응력이 타의 추종을 불허합니다. 어떤 어려움이 닥쳐도 정면으로 부딪혀 깨지기보다는, 유연하게 휘고 돌아서 결국 살아남는 지혜를 가졌습니다. 바람이 불면 눕고, 바람이 멈추면 다시 일어나는 당신은 진정한 생존의 고수입니다. <br><br>사람들과 어울리는 것을 좋아하고 현실적인 이익을 잘 챙기는 실속파이기도 합니다. 섬세한 관찰력으로 상황을 파악하고 최선의 선택을 하는 능력이 뛰어납니다.",
    "丙": "당신은 하늘에 떠 있는 태양입니다. 숨기려 해도 숨겨지지 않는 화려한 존재감이 당신의 가장 큰 무기입니다. 매사에 열정적이고 적극적이며, 사람들에게 베푸는 것을 좋아하여 주변에 항상 사람들이 모여듭니다. <br><br>거짓말을 잘 못하고 감정이 얼굴에 그대로 드러나는 솔직 담백한 성격입니다. 예의와 공중도덕을 중시하며, 불의를 보면 참지 못하는 정의감도 있습니다. <br><br>하지만 욱하는 성질이 있어 순간적으로 화를 참지 못해 일을 그르칠 수 있으니, 감정 조절만 잘한다면 만인의 존경을 받는 태양이 될 것입니다. 밝고 명랑한 에너지로 주변을 즐겁게 만드는 분위기 메이커입니다.",
    "丁": "당신은 어둠을 밝히는 은은한 촛불이나 밤하늘의 달빛과 같습니다. 겉으로는 조용하고 차분해 보이지만, 그 속에는 용광로처럼 뜨거운 열정과 에너지를 품고 있습니다. 한 가지 분야에 꽂히면 무서운 집중력을 발휘하여 전문가의 경지에 오르는 '장인 정신'의 소유자입니다. <br><br>섬세하고 감수성이 풍부하여 남의 아픔에 잘 공감하고 배려심이 깊습니다. 사람을 챙기는 것을 좋아하여 '엄마' 같은 따뜻함을 줍니다. <br><br>하지만 한번 토라지거나 상처를 받으면 꽁하고 오랫동안 마음에 담아두는 경향이 있으며, 친한 사람에게 집착하는 모습을 보이기도 합니다. 조용하지만 깊은 카리스마를 가진 젠틀맨입니다.",
    "戊": "당신은 만물을 품어주는 거대한 산이나 드넓은 광야입니다. 언제나 그 자리에 묵묵히 서 있는 산처럼, 믿음직스럽고 신뢰감을 주는 사람입니다. 말과 행동이 가볍지 않고 진중하여, 주변 사람들이 당신에게 비밀을 털어놓거나 의지하고 싶어 합니다. <br><br>포용력이 넓어 다양한 사람들을 받아들이고 중재하는 역할을 잘합니다. 하지만 산이 쉽게 움직이지 않듯, 당신 또한 변화를 싫어하고 고집이 셉니다. <br><br>한번 정한 생각은 좀처럼 바꾸려 하지 않아 '벽창호'라는 소리를 들을 수도 있습니다. 때로는 과감하게 움직이는 융통성을 발휘한다면 더 큰 성취를 이룰 수 있습니다. 안정적이고 책임감 있는 든든한 가장 스타일입니다.",
    "己": "당신은 농작물을 길러내는 비옥한 논밭과 같습니다. 겉모습은 소박하고 평범해 보일지 몰라도, 그 안에는 수많은 생명을 키워내는 기막힌 다재다능함이 숨어 있습니다. 실속을 중요하게 생각하여 무모한 도전보다는 확실하고 안정적인 길을 선택하는 현명함이 있습니다. <br><br>이해타산이 빠르고 눈치가 좋아 사회생활을 아주 잘합니다. 남에게 모진 소리를 잘 못하고 웬만하면 맞춰주려 하지만, 자기 것은 확실하게 챙기는 스타일입니다. <br><br>남을 가르치고 키우는 일에 보람을 느끼며, 꼼꼼하고 세심한 일처리가 돋보입니다. 다만 의심이 많아 기회를 놓칠 수 있으니 주의하세요. 실속 있고 알뜰한 현실주의자입니다.",
    "庚": "당신은 제련되지 않은 거친 원석이나 단단한 무쇠입니다. 투박하지만 강력한 힘과 카리스마를 가지고 있습니다. 옳고 그름이 명확하여, 아닌 것은 아니라고 딱 잘라 말하는 결단력이 있습니다. 의리를 목숨처럼 중요하게 생각하여, 내 사람이라고 생각되면 끝까지 책임지는 상남자 스타일입니다. <br><br>개혁적인 성향이 강해 기존의 낡은 관습을 타파하고 새로운 질서를 만드는 것을 좋아합니다. 하지만 너무 강하면 부러지기 쉽습니다. <br><br>융통성이 부족하고 자신의 주장만 고집하다가 주변과 마찰을 빚을 수 있습니다. 자신을 갈고닦아 세련된 모습으로 거듭난다면 세상을 호령할 큰 그릇입니다. 강직하고 의리 있는 자수성가형 인재입니다.",
    "辛": "당신은 이미 세공이 끝난 반짝이는 보석이나 날카로운 칼날입니다. 섬세하고 예민하며, 깔끔하고 완벽한 것을 추구합니다. 남들에게 보여지는 이미지를 중요하게 생각하여 겉모습을 꾸미는 데 관심이 많고 감각도 뛰어납니다. <br><br>자존심이 하늘을 찌르고, 본인이 최고라고 생각하는 '왕자' 기질이 있습니다. 남의 간섭이나 잔소리를 누구보다 싫어합니다. <br><br>예리한 관찰력으로 남의 허를 찌르는 말을 잘하며, 한번 상처를 받으면 차갑게 돌아서는 냉정함도 있습니다. 그만큼 자신을 빛나게 하는 능력이 탁월하여 어디서든 주목받는 존재입니다. 세련되고 완벽주의적인 귀공자 스타일입니다.",
    "壬": "당신은 끝을 알 수 없는 깊은 바다나 큰 호수입니다. 마음이 바다처럼 넓어 모든 것을 받아들이는 포용력이 있고, 지혜와 총명함을 타고났습니다. 자유롭게 흐르는 물처럼 어디에도 얽매이지 않는 자유로운 영혼의 소유자이며, 임기응변에 능하고 상황 대처 능력이 뛰어납니다. <br><br>스케일이 크고 야망이 있으며, 해외와 인연이 깊습니다. 사교성이 좋아 두루두루 잘 어울리지만, 정작 자신의 진짜 속마음은 깊은 물속에 감추고 보여주지 않습니다. <br><br>그래서 '속을 알 수 없는 사람'이라는 평을 듣기도 합니다. 한곳에 머물기보다는 끊임없이 새로운 세상으로 나아가려는 역마의 기운이 강합니다. 영리하고 스케일 큰 지략가입니다.",
    "癸": "당신은 대지를 적시는 봄비나 졸졸 흐르는 시냇물입니다. 맑고 순수한 영혼을 가졌으며, 타인의 감정에 민감하게 반응하고 공감해주는 따뜻한 마음씨를 지녔습니다. 아이디어와 상상력이 풍부하고 두뇌 회전이 빨라, 남들이 생각지 못한 기발한 발상으로 주변을 놀라게 합니다. <br><br>작은 물방울이 바위를 뚫듯, 겉으로는 여려 보이지만 끈기와 인내심이 대단합니다. 하지만 감정 기복이 심해 우울감에 빠지기 쉽고, 남의 눈치를 너무 많이 보는 경향이 있습니다. <br><br>조용히 자신의 자리를 지키며 주변을 부드럽게 변화시키는 '외유내강'의 전형입니다. 순수하고 감성적이며 창의적인 아이디어맨입니다."
};

const natureMapFemale = {
    "甲": "당신은 곧게 뻗은 나무처럼 당당한 매력을 가진 커리어우먼 스타일입니다. 자존심이 높고 주관이 뚜렷하여 누구에게도 휘둘리지 않는 강인함을 지녔습니다. <br><br>리더십이 뛰어나고 독립적인 성향이 강해, 본인이 주도하여 일을 추진할 때 가장 큰 능력을 발휘합니다. 남에게 의지하기보다는 스스로 길을 개척하는 것을 선호합니다. <br><br>정의롭고 원칙을 중시하며, 불합리한 것을 보면 참지 못하는 성격입니다. 다만 때로는 융통성을 발휘하여 부드럽게 대처하는 것도 필요합니다. 능력 있고 자신감 넘치는 모습으로 주변을 이끌어가는 강한 여성입니다.",
    "乙": "당신은 아름답고 유연한 꽃과 같습니다. 환경 적응력이 뛰어나고 사람들의 마음을 사로잡는 매력이 있습니다. 겉으로는 부드럽고 여리게 보이지만, 속으로는 강한 생명력과 끈기를 가지고 있습니다. <br><br>어떤 상황에서도 살아남는 지혜와 유연함이 있으며, 사람들과 잘 어울리고 눈치가 빠릅니다. 현실적인 감각이 뛰어나 실속을 잘 챙기는 스타일입니다. <br><br>섬세한 관찰력으로 상황을 파악하고 최선의 선택을 하는 능력이 있습니다. 부드러운 카리스마로 주변 사람들을 자연스럽게 이끄는 매력적인 여성입니다.",
    "丙": "당신은 열정적인 태양처럼 당당합니다. 화려한 존재감을 뽐내며 어디서나 분위기를 주도하는 여왕 같은 기질이 있습니다. 매사에 적극적이고 열정적이며, 사람들에게 베푸는 것을 좋아합니다. <br><br>솔직하고 정직한 성격으로 거짓말을 잘 못하며, 감정이 얼굴에 그대로 드러납니다. 예의와 공정함을 중시하며, 불의를 보면 참지 못하는 정의감이 있습니다. <br><br>하지만 욱하는 성질이 있어 감정 조절이 필요합니다. 밝고 명랑한 에너지로 주변을 즐겁게 만드는 분위기 메이커이며, 리더십이 뛰어난 당당한 여성입니다.",
    "丁": "당신은 밤하늘의 달빛처럼 우아하고 섬세합니다. 배려심이 깊고 사람을 따뜻하게 안아주는 자애로움을 가졌습니다. 겉으로는 조용하고 차분해 보이지만, 속에는 뜨거운 열정과 집중력을 품고 있습니다. <br><br>한 가지 분야에 꽂히면 전문가의 경지에 오를 때까지 파고드는 장인 정신이 있습니다. 섬세하고 감수성이 풍부하여 남의 아픔에 잘 공감하고 세심하게 챙겨줍니다. <br><br>하지만 상처를 받으면 오래 마음에 담아두는 경향이 있으니 솔직한 대화가 필요합니다. 은은하지만 깊은 카리스마를 가진 우아한 여성입니다.",
    "戊": "당신은 듬직하고 포용력 넓은 산과 같습니다. 흔들림 없는 평온함과 넓은 마음으로 주변을 감싸는 힘이 있습니다. 믿음직스럽고 신뢰감을 주는 성격으로, 주변 사람들이 당신에게 의지하고 싶어 합니다. <br><br>포용력이 넓어 다양한 사람들을 받아들이고 중재하는 역할을 잘합니다. 현실적이고 안정적인 것을 선호하며, 책임감이 강합니다. <br><br>하지만 고집이 세고 변화를 싫어하는 면이 있으니, 때로는 유연하게 대처하는 것이 필요합니다. 안정적이고 든든한 가정을 꾸리는 능력이 뛰어난 여성입니다.",
    "己": "당신은 풍요로운 대지처럼 포용력이 좋습니다. 알뜰살뜰하게 실속과 사람을 모두 챙기는 실천적인 리더입니다. 겉모습은 소박해 보일지 몰라도, 그 안에는 다재다능한 능력이 숨어 있습니다. <br><br>이해타산이 빠르고 눈치가 좋아 사회생활을 아주 잘합니다. 꼼꼼하고 세심한 일처리로 신뢰를 얻으며, 남을 가르치고 키우는 일에 보람을 느낍니다. <br><br>현실적인 감각이 뛰어나 배우자로서, 어머니로서 최고의 자질을 갖췄습니다. 실속 있고 알뜰하게 가정을 꾸려나가는 현명한 여성입니다.",
    "庚": "당신은 의리 있고 결단력 있는 여장부 스타일입니다. 시원시원한 성격으로 복잡한 일을 단번에 해결하는 능력이 있습니다. 옳고 그름이 명확하여 아닌 것은 아니라고 딱 잘라 말하는 결단력이 있습니다. <br><br>의리를 목숨처럼 중요하게 생각하며, 내 사람이라고 생각되면 끝까지 책임지는 스타일입니다. 개혁적인 성향이 강해 새로운 것을 만들어내는 것을 좋아합니다. <br><br>하지만 자기주장이 강해 주변과 마찰을 빚을 수 있으니, 부드러운 대화법을 익히는 것이 좋습니다. 강직하고 카리스마 있는 리더형 여성입니다.",
    "辛": "당신은 반짝이는 보석처럼 섬세하고 완벽을 추구합니다. 고결한 분위기를 자아내며 미적 감각이 매우 뛰어납니다. 남들에게 보여지는 이미지를 중요하게 생각하여 항상 세련되고 우아한 모습을 유지합니다. <br><br>자존심이 높고 본인만의 확고한 기준이 있어 눈이 높은 편입니다. 예민한 감수성 때문에 사소한 것에도 쉽게 상처받을 수 있습니다. <br><br>하지만 그만큼 자신을 빛나게 하는 능력이 탁월하여 어디서든 주목받는 존재입니다. 완벽주의 성향을 조금 내려놓으면 더 편안한 삶을 살 수 있습니다. 우아하고 세련된 공주 같은 여성입니다.",
    "壬": "당신은 깊은 호수처럼 신비롭고 지혜롭습니다. 통찰력이 뛰어나며 자유분방한 사고로 세상을 바라봅니다. 마음이 넓어 모든 것을 받아들이는 포용력이 있고, 지혜와 총명함을 타고났습니다. <br><br>스케일이 크고 야망이 있으며, 해외와 인연이 깊습니다. 사교성이 좋아 두루두루 잘 어울리지만, 진짜 속마음은 깊은 물속에 감추고 보여주지 않습니다. <br><br>자유로운 영혼의 소유자로 어디에도 얽매이지 않으며, 임기응변에 능합니다. 한곳에 머물기보다 끊임없이 새로운 세상을 탐험하는 역마의 기운이 강한 지적인 여성입니다.",
    "癸": "당신은 촉촉한 봄비처럼 다정다감합니다. 사람들의 마음을 어루만지는 공감 능력이 탁월하고 영리합니다. 맑고 순수한 영혼을 가졌으며, 타인의 감정에 민감하게 반응하고 따뜻하게 공감해줍니다. <br><br>아이디어와 상상력이 풍부하고 두뇌 회전이 빨라, 남들이 생각지 못한 기발한 발상으로 주변을 놀라게 합니다. 섬세하고 배려심이 깊어 사람들을 편안하게 만드는 능력이 있습니다. <br><br>하지만 감정 기복이 심하고 남의 눈치를 많이 보는 경향이 있습니다. 자신의 감정을 솔직하게 표현하는 연습이 필요합니다. 순수하고 감성적이며 창의적인 매력을 가진 여성입니다."
};

const fortune2026Map = {
    "甲": "2026년은 당신의 재능이 꽃을 피우는 해입니다. 태양(丙)이 나무(甲)를 비추니 그동안 준비했던 것들이 세상 밖으로 드러나 인정을 받게 됩니다. 활동력이 왕성해지고 표현하고 싶은 욕구가 강해집니다. 다만 너무 에너지를 쏟아내다 보면 건강을 해칠 수 있으니 휴식도 필요합니다.<br><br><strong>💡 행운의 팁:</strong> 자신의 아이디어를 적극적으로 알리세요. 유튜브나 SNS 활동도 좋습니다.",
    "乙": "인생의 하이라이트와 같은 화려한 한 해입니다. 당신의 매력이 널리 알려져 인기가 급상승하고, 숨겨진 재능을 마음껏 뽐낼 수 있는 무대가 마련됩니다. 예술이나 창작 활동을 한다면 대박이 날 수 있습니다. 다만, 말과 행동이 과감해져서 구설수에 오를 수도 있으니 겸손함을 잃지 마세요.<br><br><strong>💡 행운의 팁:</strong> 화려한 옷이나 악세서리가 행운을 부릅니다.",
    "丙": "불이 불을 만난 형국으로, 경쟁심과 승부욕이 불타오르는 해입니다. 친구나 동료들과 함께 협력하여 큰일을 도모할 수도 있지만, 반대로 치열한 경쟁 상황에 놓일 수도 있습니다. 자신감이 넘치고 추진력이 강해지지만, 독단적인 결정은 피해야 합니다. 재물보다는 명예나 사람을 얻는 데 집중하세요.<br><br><strong>💡 행운의 팁:</strong> 독단적인 행동보다는 팀워크를 중시하세요.",
    "丁": "강력한 조력자를 만나거나 경쟁을 통해 성장하는 시기입니다. 당신의 은은한 불빛이 거대한 태양을 만나 빛을 잃는 듯하지만, 오히려 큰 불에 합세하여 세력을 키우는 기회가 될 수 있습니다. 혼자 하기 벅찬 일들은 주변의 도움을 받으면 쉽게 해결됩니다. 형제나 친구 관계로 인한 금전 지출에 주의하세요.<br><br><strong>💡 행운의 팁:</strong> 주변 사람들에게 베푸는 것이 나중에 큰 복으로 돌아옵니다.",
    "戊": "문서운과 학업운이 매우 좋은 해입니다. 당신의 넓은 땅에 뜨거운 태양 빛이 쏟아지니, 만물이 무럭무럭 자라나는 격입니다. 부동산 계약, 자격증 취득, 승진 시험 등에 유리합니다. 윗사람이나 귀인의 도움을 받아 안정적인 기반을 다질 수 있습니다. 다만 생각이 너무 많아져 실천이 늦어질 수 있습니다.<br><br><strong>💡 행운의 팁:</strong> 중요한 계약이나 문서는 꼼꼼히 검토하세요.",
    "己": "노력에 대한 보상을 확실하게 받는 정직한 해입니다. 흙이 불에 구워져 단단한 그릇이 되듯, 당신의 실력과 지위가 한층 견고해집니다. 학문적인 성취나 전문 분야에서의 인정이 따릅니다. 다만 너무 원칙만 고집하다가 융통성 없다는 소리를 들을 수 있으니 유연하게 대처하세요.<br><br><strong>💡 행운의 팁:</strong> 새로운 배움이나 자격증 취득에 도전해보세요.",
    "庚": "직장운과 명예운이 상승하는 시기입니다. 강력한 불(관성)이 당신(쇠)을 단련시키니, 힘든 과정이 있더라도 결과적으로는 멋진 명검으로 거듭나게 됩니다. 승진이나 취업, 이직 등 커리어에 큰 변화가 생길 수 있습니다. 스트레스 관리가 필수이며, 과로를 피해야 합니다.<br><br><strong>💡 행운의 팁:</strong> 규칙적인 운동으로 체력을 관리하세요.",
    "辛": "새로운 사랑이 찾아오거나 직장에서 인정을 받는 해입니다. 당신(보석)이 조명을 받아 반짝이는 형국입니다. 다만 불이 너무 강하면 보석이 녹을 수도 있으니, 무리한 욕심이나 감정적인 대응은 금물입니다. 관재구설에 휘말리지 않도록 언행을 조심하고, 건강 관리에 신경 써야 합니다.<br><br><strong>💡 행운의 팁:</strong> 붉은색 계열의 소품은 피하는 것이 좋습니다.",
    "壬": "역동적인 재물운이 들어오는 시기입니다. 물과 불이 부딪혀 수증기를 일으키듯, 큰돈이 들어오고 나가는 등 변화가 무쌍합니다. 사업을 확장하거나 투자를 하기에 좋은 기회이지만, 리스크 관리도 철저히 해야 합니다. 예상치 못한 횡재수가 있을 수 있으나, 과욕은 화를 부릅니다.<br><br><strong>💡 행운의 팁:</strong> 철저한 분석 없는 투자는 금물입니다.",
    "癸": "안정적인 수입과 결과물이 따르는 해입니다. 뜨거운 열기를 시원한 비가 식혀주듯, 당신의 존재가 조직이나 모임에서 환영받게 됩니다. 재물운이 안정적이며, 남자가 여자에게, 여자가 남자에게 헌신하는 운이기도 합니다. 꼼꼼하게 실속을 챙기면 알토란 같은 재산을 모을 수 있습니다.<br><br><strong>💡 행운의 팁:</strong> 저축이나 적금 등 안정적인 자산 관리가 좋습니다."
};

const pillarInterpretations = {
    "甲": {
        nature_year: "자라나는 어린 묘목 🌱", nature_month: "숲을 이루는 거목 🌳", nature_day: "곧게 뻗은 대림목 🌲", nature_hour: "지혜로운 고목 🪵", keyword: "🌱 성장, 🦁 리더십, 😤 자존심",
        year: "어린 시절부터 리더십이 돋보였습니다. 승부욕이 있어 무엇이든 1등을 하려 노력했고 정의로운 성향이었습니다.",
        month: "사회 활동이 왕성하며 조직에서 핵심 리더 역할을 합니다. 명예를 중시하고 책임감이 강합니다.",
        day: "굽히지 않는 자존심과 강력한 추진력이 삶의 원동력입니다. 시련이 닥쳐도 오똑이처럼 다시 일어납니다.",
        hour: "말년에는 쌓아온 지혜로 존경받는 스승이나 정신적 지주가 됩니다. 끊임없이 공부하는 노년을 보냅니다."
    },
    "乙": {
        nature_year: "봄바람에 흔들리는 꽃 🌸", nature_month: "담장을 넘는 덩굴 🌿", nature_day: "끈질긴 잡초/넝쿨 🌱", nature_hour: "열매 맺은 화초 🌻", keyword: "🌿 적응력, 🧗 끈기, 💰 현실적",
        year: "환경 적응력이 뛰어나고 눈치가 빨랐습니다. 힘든 일도 웃어넘기는 강인함을 일찍 갖췄습니다.",
        month: "유연한 처세술로 어떤 조직에서도 살아남습니다. 기회를 포착하는 감각과 근성이 대단합니다.",
        day: "유연함이 최대 무기이며 실속을 챙길 줄 압니다. 장애물을 만나면 우회하여 결실을 맺는 타입입니다.",
        hour: "자녀와 유대감이 깊고 편안한 노후를 즐깁니다. 소소한 취미로 삶의 즐거움을 찾는 여유가 있습니다."
    },
    "丙": {
        nature_year: "떠오르는 아침 해 🌅", nature_month: "한낮의 뜨거운 태양 ☀️", nature_day: "만물을 비추는 빛 ✨", nature_hour: "노을 지는 석양 🌇", keyword: "🔥 열정, 🙏 예의, ✨ 화려함",
        year: "어디서나 주목받는 밝은 아이였습니다. 감정이 솔직하게 드러나며 정이 많은 어린 시절이었습니다.",
        month: "언변과 사교성으로 대중을 사로잡습니다. 에너지가 넘치고 공정한 업무 처리를 선호합니다.",
        day: "공평하고 정의로운 성품입니다. 매사에 열정적이고 뒤끝이 없고 쿨하여 사람들에게 인기가 많습니다.",
        hour: "식지 않는 열정으로 사회에 공헌하는 삶을 삽니다. 주변이 따르는 영향력 있는 어른이 됩니다."
    },
    "丁": {
        nature_year: "반짝이는 별빛 ✨", nature_month: "활활 타는 모닥불 🔥", nature_day: "은은한 촛불 🕯️", nature_hour: "밤하늘의 달빛 🌙", keyword: "🕯️ 헌신, 🎀 섬세함, 🌙 은근함",
        year: "조용하지만 집중력이 뛰어난 아이였습니다. 감수성이 풍부하고 소수와 깊은 우정을 나누는 편입니다.",
        month: "전문 지식으로 인정받습니다. 디테일에 강하고 동료를 세심하게 챙기는 스타일입니다.",
        day: "내면에 뜨거운 열정을 품은 외유내강형입니다. 묵묵히 헌신하며 사람의 마음을 얻습니다.",
        hour: "종교나 철학 등 정신적 가치를 중시합니다. 지혜를 전하며 고상하고 품위 있는 말년을 보냅니다."
    },
    "戊": {
        nature_year: "언덕 뒤의 동산 ⛰️", nature_month: "웅장한 태산 🌋", nature_day: "드넓은 광야 🏜️", nature_hour: "노을진 산맥 🌄", keyword: "🤝 신용, 🏔️ 포용력, 🐂 고집",
        year: "또래보다 성숙하고 진중했습니다. 친구들이 믿고 의지하는 든든한 등대 같은 아이였습니다.",
        month: "신용을 최우선으로 하며 조직의 중심을 잡습니다. 안정적인 분야에서 꾸준히 성과를 냅니다.",
        day: "흔들림 없는 주관과 포용력을 가졌습니다. 말보다 행동으로 보여주는 묵직한 매력이 있습니다.",
        hour: "재산과 덕망을 바탕으로 풍요로운 노후를 누립니다. 가문의 든든한 버팀목이 되는 큰 어른입니다."
    },
    "己": {
        nature_year: "작은 화단 🌱", nature_month: "생산적인 농장 🚜", nature_day: "비옥한 텃밭 🌾", nature_hour: "평온한 전원 🏡", keyword: "🌾 실속, 🎨 다재다능, 🧹 자기관리",
        year: "영리하고 야무진 아이였습니다. 다재다능하여 습득력이 빨랐고 중재자 역할을 잘했습니다.",
        month: "꼼꼼한 일처리로 최고의 실무 능력을 보입니다. 관리와 교육 분야에서 특히 빛을 발합니다.",
        day: "겸손함 속에 치밀한 계획을 갖춘 실속파입니다. 자기관리가 철저하며 성실하게 목표를 이룹니다.",
        hour: "후학 양성이나 자녀 교육에 보람을 느낍니다. 알찬 노후 활동으로 조용하지만 실속 있게 삽니다."
    },
    "庚": {
        nature_year: "원석 💎", nature_month: "제련소의 무쇠 🔨", nature_day: "단단한 바위 🪨", nature_hour: "완성된 도검 ⚔️", keyword: "⚔️ 의리, 🔪 결단력, 🛠️ 개혁",
        year: "정의감이 넘치는 의리파 대장 스타일이었습니다. 운동이나 활동적인 분야에서 두각을 보였습니다.",
        month: "추진력이 강한 카리스마 리더입니다. 공과 사가 명확하며 결단이 필요한 순간 진가를 발휘합니다.",
        day: "거칠지만 순수한 힘을 가졌습니다. 신념이 강하고 한번 맺은 인연을 끝까지 소중히 합니다.",
        hour: "자신만의 원칙을 지키며 명예롭게 늙어갑니다. 엄격한 자기관리로 주변에 덕을 끼치는 노후입니다."
    },
    "辛": {
        nature_year: "예쁜 구슬 🔮", nature_month: "수술용 칼 🔪", nature_day: "빛나는 다이아몬드 💎", nature_hour: "보물 👑", keyword: "💎 섬세, 📏 예민, ✨ 깔끔",
        year: "예민하고 미적 감각이 뛰어난 아이였습니다. 자존심이 세고 세련된 분위기를 좋아했습니다.",
        month: "정밀하고 섬세한 전문직에서 성공합니다. 완벽주의 성향이며 트렌드를 읽는 눈이 예리합니다.",
        day: "자신을 빛내는 능력이 탁월합니다. 냉철한 이성을 가졌지만 내 사람에게는 아낌없이 베풉니다.",
        hour: "품위와 여유를 잃지 않는 우아한 말년을 즐깁니다. 세련된 취미로 젊은 감각을 유지합니다."
    },
    "壬": {
        nature_year: "시냇물 💧", nature_month: "댐의 물 🌊", nature_day: "넓은 바다 🌊", nature_hour: "고요한 호수 🏞️", keyword: "🌊 지혜, 🌍 역마, 🎭 임기응변",
        year: "자유로운 탐험을 즐기는 아이였습니다. 스케일이 크고 대범하며 조숙한 면이 있었습니다.",
        month: "유연한 사고로 큰 무대에서 활약합니다. 아이디어가 풍부하고 정보 수집 능력이 뛰어납니다.",
        day: "마음이 깊고 포용력이 넓습니다. 어떤 상황에도 얽매이지 않고 지혜롭게 난관을 극복합니다.",
        hour: "세상의 이치를 통달한 현자처럼 깊은 지혜를 갖습니다. 물 흐르듯 평화로운 노년을 보냅니다."
    },
    "癸": {
        nature_year: "아침 이슬 💧", nature_month: "대지를 적시는 비 🌧️", nature_day: "옹달샘 🏞️", nature_hour: "신비로운 안개 🌫️", keyword: "☔ 감수성, 💡 아이디어, 🕊️ 순수",
        year: "마음이 여리고 상상력이 풍부한 순수 소년/소녀였습니다. 공감 능력이 좋아 인기가 많았습니다.",
        month: "아이디어로 승부하는 전략가입니다. 전면보다는 참모 역할에서 부드러운 카리스마를 보입니다.",
        day: "투명하고 맑은 수호천사 같은 영혼입니다. 겉은 여려 보이지만 바위를 뚫는 끈기가 있습니다.",
        hour: "안식처 같은 평온한 말년을 보냅니다. 자애로운 모습으로 주변을 감싸며 명상과 봉사를 즐깁니다."
    }
};




function getColoredHtml(stem, branch) {
    if (stem === "모" && branch === "름") return `<div class="pillar-box"><span class="unknown-pillar">${TRANSLATIONS[currentLang].time_unknown}</span></div>`;

    const sMap = currentLang === 'en' ? stemReadings_en : stemReadings_ko;
    const bMap = currentLang === 'en' ? branchReadings_en : branchReadings_ko;
    const sRead = sMap[stem] || "?";
    const bRead = bMap[branch] || "?";
    const sColor = getColorClass(stem);
    const bColor = getColorClass(branch);

    return `<div class="pillar-box">
                <div class="pillar-item">
                    <span class="${sColor} char-main">${stem}</span>
                    <span class="char-sub">${sRead}</span>
                </div>
                <div class="pillar-item">
                    <span class="${bColor} char-main">${branch}</span>
                    <span class="char-sub">${bRead}</span>
                </div>
            </div>`;
}

function calculatePillars(year, month, day, timeIdx) {
    // 년주
    const sIdx = (year - 4) % 10;
    const bIdx = (year - 4) % 12;
    const yearStem = stems[sIdx < 0 ? sIdx + 10 : sIdx];
    const yearBranch = branches[bIdx < 0 ? bIdx + 12 : bIdx];

    // 월주 (근사치)
    let mBIdx = (month + 12 - 2) % 12 + 2;
    if (mBIdx >= 12) mBIdx -= 12;
    const yStemIdx = stems.indexOf(yearStem);
    const mSBase = (yStemIdx % 5) * 2 + 2;
    const mSIdx = (mSBase + (month - 2)) % 10;
    const monthStem = stems[mSIdx < 0 ? mSIdx + 10 : mSIdx];
    const monthBranch = branches[mBIdx];

    // 일주
    const base = new Date(1900, 0, 1);
    const target = new Date(year, month - 1, day);
    const diffDays = Math.ceil(Math.abs(target - base) / (1000 * 60 * 60 * 24));
    const dayCyclic = (10 + diffDays) % 60;
    const dayStem = stems[dayCyclic % 10];
    const dayBranch = branches[dayCyclic % 12];

    // 시주
    let hourStem = "?";
    let hourBranch = "?";

    // timeIdx 정수형 변환 (문자열 "99" 등 처리)
    const tIdx = parseInt(timeIdx);

    // 시주 계산 로직 (우선순위: 모름 체크 -> 값 유효성 체크 -> 계산)
    if (timeIdx == 99 || timeIdx === "99" || isNaN(tIdx) || tIdx === 99) {
        hourStem = "모"; hourBranch = "름";
    }
    else if (tIdx >= 0 && tIdx < 12) {
        hourBranch = branches[tIdx];
        const dStemIdx = stems.indexOf(dayStem);
        const hSBase = (dStemIdx % 5) * 2;
        const hSIdx = (hSBase + tIdx) % 10;
        hourStem = stems[hSIdx];
    }
    else {
        hourStem = "모"; hourBranch = "름";
    }

    return {
        year: { s: yearStem, b: yearBranch },
        month: { s: monthStem, b: monthBranch },
        day: { s: dayStem, b: dayBranch },
        hour: { s: hourStem, b: hourBranch }
    };
}


async function analyzeSaju(e) {
    e.preventDefault();

    // 개인정보 동의 체크 확인
    const agree = document.getElementById('privacy-agreement').checked;
    if (!agree) {
        alert(TRANSLATIONS[currentLang].alert_privacy);
        return;
    }

    let name = document.getElementById('userName').value.trim();
    if (!name) {
        name = currentLang === 'en' ? "Guest" : "방문자";
    }

    const gender = document.querySelector('input[name="userGender"]:checked')?.value;
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const time = document.getElementById('birthTime').value;

    // ✅ 입력값 검증
    if (!gender) {
        alert(currentLang === 'en' ? 'Please select gender.' : '성별을 선택해주세요.');
        return;
    }

    if (isNaN(year) || year < 1900 || year > 2100) {
        alert(currentLang === 'en' ? 'Please enter a valid birth year (1900-2100).' : '올바른 생년을 입력해주세요 (1900-2100).');
        return;
    }

    if (isNaN(month) || month < 1 || month > 12) {
        alert(currentLang === 'en' ? 'Please select a valid month.' : '올바른 월을 선택해주세요.');
        return;
    }

    if (isNaN(day) || day < 1 || day > 31) {
        alert(currentLang === 'en' ? 'Please select a valid day.' : '올바른 일을 선택해주세요.');
        return;
    }

    // 월별 일수 체크
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
        alert(currentLang === 'en'
            ? `${month} month has only ${daysInMonth} days.`
            : `${month}월은 ${daysInMonth}일까지만 있습니다.`);
        return;
    }

    if (!time) {
        alert(currentLang === 'en' ? 'Please select birth time.' : '태어난 시간을 선택해주세요.');
        return;
    }

    document.getElementById('loading').style.display = 'flex';

    // 💾 로컬 저장소에 저장 (최근 히스토리)
    saveToHistory({ name, gender, year, month, day, time });


    try {
        // 🔐 이름 간단 암호화 (Base64 + 타임스탬프)
        const timestamp = new Date().getTime();
        const nameToEncrypt = name + '|' + timestamp;
        const encryptedName = btoa(unescape(encodeURIComponent(nameToEncrypt)));

        // Google Apps Script 연동 (암호화된 이름 전송)
        fetch("https://script.google.com/macros/s/AKfycbww-jTAJsHmkyMnbPdkBJBr8vKaeuoMe1vPv_8z-siuB2gPNMTy-GRCvS2QoVmARPPt/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ name: encryptedName, gender, year, month, day, time })
        }).catch(err => {
            console.error("데이터 전송 실패:", err);
            // 전송 실패해도 분석은 계속 진행 (통계 수집 실패만)
        });

        const pillars = calculatePillars(year, month, day, time);
        currentPillars = pillars;

        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
            if (!adShown) {
                pendingData = { name, gender, year, month, day, pillars };
                showAdWithCountdown();
            } else {
                showSajuResult({ name, gender, year, month, day, pillars });
            }
        }, 1200);
    } catch (error) {
        console.error("분석 오류:", error);
        document.getElementById('loading').style.display = 'none';
        alert(currentLang === 'en'
            ? 'An error occurred. Please try again.'
            : '오류가 발생했습니다. 다시 시도해주세요.');
    }
}


// 광고 표시 및 카운트다운 (전체 화면 방식)
function showAdWithCountdown() {
    document.getElementById('input-screen').style.display = 'none';
    const adScreen = document.getElementById('ad-screen');
    if (adScreen) adScreen.style.display = 'flex';

    let countdown = 5;
    const countdownEl = document.getElementById('countdown-number');
    const skipBtn = document.getElementById('skip-ad-btn');

    // 초기화
    if (countdownEl) countdownEl.textContent = countdown;
    if (skipBtn) {
        skipBtn.disabled = true;
        skipBtn.textContent = TRANSLATIONS[currentLang].btn_wait;
        skipBtn.style.opacity = '0.5';
    }

    const interval = setInterval(() => {
        countdown--;
        if (countdownEl) countdownEl.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(interval);
            if (skipBtn) {
                skipBtn.disabled = false;
                skipBtn.textContent = TRANSLATIONS[currentLang].btn_view_result;
                skipBtn.classList.add('active');
                skipBtn.style.opacity = '1';
            }
        }
    }, 1000);
}

function skipAd() {
    adShown = true;
    const adScreen = document.getElementById('ad-screen');
    if (adScreen) adScreen.style.display = 'none';

    if (pendingData) {
        showSajuResult(pendingData);
        pendingData = null;
    }
}

const wealthMap = {
    "甲": "당신에게 재물은 '흙'의 기운입니다. 넓은 대지에 뿌리를 내리듯, 부동산이나 안정적인 자산 관리에 소질이 있습니다. 한꺼번에 큰돈을 노리기보다는 성실하게 일구어가는 재물이 결국 큰 산을 이룹니다. <br><br>명예를 쫓다 보면 재물이 따르는 격이니, 자신의 가치를 높이는 데 투자하세요. 인색하기보다는 적절히 베풀 때 더 큰 부가 돌아오는 명량한 재물운을 가졌습니다.",
    "乙": "당신에게 재물은 '비옥한 땅'입니다. 작은 풀이 넓은 벌판을 덮듯, 꾸준하고 끈기 있게 재산을 모으는 능력이 탁월합니다. 정보력이 좋고 현실적인 감각이 뛰어나 주식이나 유동 자산 투자에도 소질이 있습니다. <br><br>동업보다는 단독으로 결정할 때 실속을 챙길 수 있습니다. 겉으로 드러나는 화려함보다는 내실 있는 알부자가 되는 경우가 많으며, 생활력이 매우 강합니다.",
    "丙": "당신에게 재물은 '쇠'의 기운입니다. 용광로에서 금속을 제련하듯, 과감하고 스케일 큰 투자로 큰 부를 거머쥐기도 합니다. 결단력이 좋아 기회를 포착하는 능력이 뛰어나지만, 한꺼번에 크게 잃을 위험도 있으니 리스크 관리가 필수입니다. <br><br>사업가 기질이 다분하며, 막힌 돈의 흐름을 뚫는 수완이 좋습니다. 재물에 대한 집착보다는 성취감을 중시할 때 더 큰 부가 따라옵니다.",
    "丁": "당신에게 재물은 '반짝이는 보석'입니다. 섬세하고 꼼꼼한 자산 관리가 특징입니다. 남들이 보지 못하는 틈새시장을 노리거나 전문 지식을 활용한 재테크에 강점이 있습니다. 큰 리스크를 지기보다는 안정적이고 확실한 수익을 선호합니다. <br><br>사소한 지출을 아껴 큰돈을 만드는 형국입니다. 문서나 자격증 등 자신의 전문성을 바탕으로 한 소득이 안정적이며, 중년 이후 재무 상태가 급격히 좋아지는 대기만성형입니다.",
    "戊": "당신에게 재물은 '맑은 물'입니다. 마르지 않는 샘물처럼 끊임없이 재물이 들어오는 운을 가졌습니다. 큰 산이 물을 가두어 호수를 만들듯, 번 돈을 잘 지키고 관리하는 수성(守城) 능력이 매우 뛰어납니다. <br><br>유통, 서비스, 혹은 흐름을 이용한 사업에서 큰 성과를 냅니다. 고집을 조금 내려놓고 변화하는 트렌드에 발맞춘다면 거부(巨富)가 될 수 있는 그릇을 가졌습니다.",
    "己": "당신에게 재물은 '넓은 바다'입니다. 모든 물이 바다로 모이듯, 다양한 경로를 통해 재물을 끌어당기는 힘이 있습니다. 포용력이 좋아 사람들을 통해 돈이 들어오는 인덕(人德)이 따릅니다. 겉으로는 소박해 보이지만 속으로는 큰 야망과 치밀한 계산을 품고 있습니다. <br><br>성실함을 바탕으로 한 월급 소득도 좋지만, 임대 소득이나 권리 소득 등 가만히 있어도 들어오는 구조를 만드는 데 재능이 있습니다.",
    "庚": "당신에게 재물은 '푸른 나무'입니다. 단단한 도끼로 나무를 다듬어 가구를 만들듯, 원자재를 가공하여 고부가가치를 창출하는 데 능합니다. 결과 중심적인 사고방식으로 목표한 금액은 반드시 달성하고야 마는 집념이 있습니다. <br><br>강한 추진력으로 자수성가하여 부를 이루는 경우가 많습니다. 다만 동료나 친구에게 의리를 지키다 손해를 볼 수 있으니 공과 사를 명확히 구분하는 것이 좋습니다.",
    "辛": "당신에게 재물은 '화초와 숲'입니다. 예리한 가위로 정원을 가꾸듯, 세밀하고 감각적인 분야에서 재물을 얻습니다. 취향이 고급스럽고 눈이 높아 고가의 물건이나 예술품, 혹은 트렌디한 아이템 투자에 강점이 있습니다. <br><br>작은 돈은 과감히 쓰고 큰돈을 끌어오는 '하이 리스크 하이 리턴' 성향이 있습니다. 자신의 매력과 브랜드를 활용한 소득이 매우 좋으며, 인맥이 곧 재산인 타입입니다.",
    "壬": "당신에게 재물은 '뜨거운 불'입니다. 차가운 바닷물이 태양을 받아 수증기를 만들듯, 역동적이고 변화무쌍한 재물운을 가셨습니다. 해외 운이 있어 국경을 넘나드는 비즈니스나 무역, 혹은 온라인 기반의 사업에서 큰 부를 쌓습니다. <br><br>한곳에 머물러 있기보다 바쁘게 움직일수록 돈이 쌓입니다. 화술이 좋고 임기응변이 뛰어나 협상을 통해 이득을 취하는 데 천부적인 소질이 있습니다.",
    "癸": "당신에게 재물은 '은은한 등불'입니다. 비가 내려 만물을 적시듯, 조용하면서도 실속 있게 부를 축적합니다. 기발한 아이디어나 지적 재산권을 활용한 소득에 강점이 있습니다. 겉으로 부를 과시하기보다는 남모르게 알토란 같은 자산을 늘려가는 스타일입니다. <br><br>치밀한 분석력으로 소액 투자를 반복하여 목돈을 만드는 데 능하며, 인내심을 가지고 장기 투자할 때 가장 큰 결실을 봅니다."
};

const healthMap = {
    "甲": "당신은 기운이 솟구치는 나무의 에너지를 가졌기에 담즙 분비와 신경계통의 흐름을 잘 살펴야 합니다. 스트레스가 쌓이면 간 기운이 뭉쳐 편두통이나 근육통으로 나타날 수 있습니다. <br><br><strong>💡 관리 팁:</strong> 산책이나 등산 같은 활동적인 운동으로 에너지를 발산하세요. 신맛이 나는 과일이나 녹색 채소를 섭취하는 것이 도움이 됩니다.",
    "乙": "유연한 화초의 기운을 가진 당신은 간 기능과 더불어 손발 저림 등 말초 신경계의 혈액순환에 주의해야 합니다. 몸이 차가워지면 관절이 뻣뻣해질 수 있으니 늘 따뜻하게 유지하는 것이 중요합니다. <br><br><strong>💡 관리 팁:</strong> 요가나 필라테스처럼 몸을 유연하게 만드는 운동이 최적입니다. 대칭적인 자세를 유지하고 스트레칭을 생활화하세요.",
    "丙": "강렬한 태양의 기운으로 심혈관 질환과 시력 보호에 각별히 신경 써야 합니다. 기운이 위로 솟구치기 쉬워 안면 홍조나 불면증이 생길 수 있으니 열을 내리는 습관이 필요합니다. <br><br><strong>💡 관리 팁:</strong> 자극적이고 뜨거운 음식은 피하고, 쓴맛이 나는 나물류를 챙겨 드세요. 밤늦게 스마트폰을 사용하는 것은 시력과 숙면에 좋지 않습니다.",
    "丁": "은은한 등불의 기운으로 심장과 소장 계통의 리듬이 섬세한 편입니다. 정신적인 스트레스가 신체적인 증상으로 바로 나타나기 쉬우므로 심리적 안정을 찾는 것이 무엇보다 중요합니다. <br><br><strong>💡 관리 팁:</strong> 조용한 명상이나 차 마시는 시간을 가져보세요. 붉은색 곡물(수수, 팥 등)이 기운을 돕습니다. 규칙적인 수면이 보약입니다.",
    "戊": "듬직한 산의 기운을 가졌지만 위장 장애와 소화기 계통이 약해지기 쉽습니다. 소화되지 않은 기운이 몸 안에 고이면 비만이나 피부 트러블로 이어질 수 있으니 순환에 힘써야 합니다. <br><br><strong>💡 관리 팁:</strong> 규칙적인 식습관은 필수입니다. 복부 마사지를 자주 해주고, 흙의 기운을 보강해주는 노란색 음식(호박, 고구마 등)을 권장합니다.",
    "己": "비옥한 텃밭의 기운으로 비장과 위장의 흡수력이 민감합니다. 생각이 너무 많으면 소화가 안 되는 스타일이므로 고민보다는 실천을 통해 마음의 짐을 덜어내야 합니다. <br><br><strong>💡 관리 팁:</strong> 배를 항상 따뜻하게 유지하세요. 생강차나 따뜻한 성질의 음식이 좋습니다. 맨발로 흙 위를 걷는 '어싱'이 건강에 큰 도움이 됩니다.",
    "庚": "단단한 바위의 기운으로 대장과 폐 기능의 리듬이 중요합니다. 건조한 환경에서는 호흡기가 쉽게 상할 수 있으며, 배변 활동이 원활하지 않으면 피부가 거칠어질 수 있습니다. <br><br><strong>💡 관리 팁:</strong> 충분한 수분 섭취와 습도 조절이 필수입니다. 도라지나 무 같은 흰색 채소가 기운을 보강해줍니다. 유산소 운동으로 폐활량을 키우세요.",
    "辛": "섬세한 보석의 기운으로 호흡기와 피부가 매우 예민합니다. 환경 오염이나 미세먼지에 민감하게 반응할 수 있으니 면역력 관리에 늘 신경 써야 하는 체질입니다. <br><br><strong>💡 관리 팁:</strong> 환기를 자주 하고 침구류를 청결히 관리하세요. 자극적인 화장품은 피하는 것이 좋습니다. 마늘이나 파 등 매운맛이 나는 음식이 면역력을 돕습니다.",
    "壬": "넓은 바다의 기운으로 신장과 방광 등 비뇨기 계통의 순환을 주의해야 합니다. 몸 안에 노폐물이 잘 쌓일 수 있어 붓기 관리가 건강의 핵심 지표가 됩니다. <br><br><strong>💡 관리 팁:</strong> 저염식 식단을 유지하고 신선한 물을 자주 마시세요. 수영이나 반신욕처럼 물과 관련된 활동이 몸의 독소 배출에 효과적입니다.",
    "癸": "깨끗한 옹달샘의 기운으로 신장 기능과 전반적인 혈액 순환을 잘 살피세요. 하체를 따뜻하게 하고 가벼운 산책을 즐기세요. <br><br><strong>💡 관리 팁:</strong> 아랫배와 하체를 따뜻하게 하는 족욕을 추천합니다. 검은콩이나 검은깨 같은 블랙 푸드가 기운을 북돋워 줍니다."
};

const studyMap = {
    "甲": "목표지향적인 성향으로 확실한 동기부여만 있으면 놀라운 집중력을 발휘합니다. 누군가에게 지시받기보다 본인이 계획을 세우고 주도할 때 학습 효율이 가장 높습니다. <br><br><strong>💡 공부 팁:</strong> 단기 합격 수기를 읽거나 경쟁자가 있는 환경에서 공부하세요. '내가 이 분야의 리더가 되겠다'는 목표가 당신을 움직입니다.",
    "乙": "유연하고 창의적인 사고력을 가졌습니다. 딱딱한 이론 위주의 암기보다는 다양한 사례를 접하고 응용 문제를 풀면서 개념을 익히는 것이 훨씬 즐겁고 효과적입니다. <br><br><strong>💡 공부 팁:</strong> 스터디 모임을 통해 의견을 나누거나 마인드맵을 활용해 지식을 연결해보세요. 예쁜 필기구나 쾌적한 학습 환경이 기분을 좋게 만듭니다.",
    "丙": "에너지가 넘치고 시각적인 자극에 민감합니다. 지루하게 오래 앉아 있는 것보다 짧은 시간 동안 폭발적으로 집중하는 '단기 집중법'이 당신에게 어울리는 방식입니다. <br><br><strong>💡 공부 팁:</strong> 인강을 1.25배속으로 듣거나 컬러풀한 형광펜으로 핵심을 표시하세요. 공부한 내용을 누군가에게 설명해주면 완전히 당신의 것이 됩니다.",
    "丁": "탐구적이고 세밀한 공부에 최적화되어 있습니다. 소음이 적고 집중할 수 있는 독서실 같은 환경에서 한 가지 주제를 깊이 있게 파고들 때 최고의 성과를 냅니다. <br><br><strong>💡 공부 팁:</strong> 새벽 시간이나 늦은 밤, 조용한 나만의 시간을 활용하세요. 요약 노트를 꼼꼼하게 작성하는 과정 자체가 당신에게는 훌륭한 학습 과정입니다.",
    "戊": "엉덩이가 무거운 타입으로 꾸준한 학습에 강점이 있습니다. 처음에는 진도가 느린 것 같아도 기초를 탄튼히 다지면 시험 막판에 엄청난 뒷심으로 추월하는 스타일입니다. <br><br><strong>💡 공부 팁:</strong> 큰 줄기부터 파악하는 거시적인 접근이 필요합니다. '꾸준함이 천재를 이긴다'는 말을 믿고 매일 정해진 양을 묵묵히 소화해내세요.",
    "己": "기록하고 정리하는 꼼꼼함이 탁월합니다. 방대한 양의 정보를 자신만의 체계로 분류하고 정리할 때 머릿속에 지식이 완벽하게 구조화되는 경험을 하게 됩니다. <br><br><strong>💡 공부 팁:</strong> 오답 노트를 만드는 데 공을 들이세요. 남의 강의를 듣는 시간보다 스스로 요약하고 암기하는 시간을 7:3 비율로 가져가는 것이 좋습니다.",
    "庚": "논리적이고 분석적인 사고에 강점이 있습니다. 무조건 외우는 것은 금방 잊어버리지만, '왜 그런지' 원리를 이해하고 나면 평생 잊지 않는 강력한 기억력을 자랑합니다. <br><br><strong>💡 공부 팁:</strong> 목차를 완벽히 이해하고 지식의 인과관계를 따져가며 공부하세요. 난도가 높은 문제에 도전할 때 정복욕이 생겨 학습 의욕이 타오릅니다.",
    "辛": "완벽주의적인 성향으로 사소한 디테일까지 놓치지 않습니다. 정밀한 계산이 필요한 수학이나 언어의 미묘한 차이를 다루는 국어나 외국어 학습에서 남다른 재능을 보입니다. <br><br><strong>💡 공부 팁:</strong> 깔끔한 환경에서 공부에만 집중할 수 있는 고독한 분위기를 조성하세요. 자신에게 엄격한 만큼 보상도 확실히 주어 번아웃을 방지해야 합니다.",
    "壬": "통찰력이 뛰어나고 전체적인 흐름을 읽는 안목이 좋습니다. 암기 위주의 공부보다는 인문학, 사회, 경제 등 지식의 맥락을 연결하는 공부에서 지적 희열을 느낍니다. <br><br><strong>💡 공부 팁:</strong> 해외 도서나 원문을 찾아보거나 큰 지도를 그리듯 공부하세요. 자유로운 사고를 방해하지 않는 개방형 도서관이나 카페가 적합한 장소일 수 있습니다.",
    "癸": "직관력이 매우 좋고 아이디어가 풍부합니다. 암송하거나 소리 내어 읽기, 혹은 청각적인 자료를 활용할 때 암기력이 극대화되는 '청각적 학습자'인 경우가 많습니다. <br><br><strong>💡 공부 팁:</strong> 질문을 통해 원리를 파악하거나 명상을 통해 집중력을 높인 뒤 공부를 시작하세요. 컨디션 기복이 성적에 영향을 주기 쉬우니 멘탈 관리가 핵심입니다."
};

function updateBackground(char) {
    const element = getColorClass(char); // wood, fire, earth, metal, water
    let c1 = "#1e1442", c2 = "#2d1b69", c3 = "#1a0f3d"; // 기본 보라색

    if (element === "wood") {
        document.documentElement.style.setProperty('--primary-color', '#2ecc71');
        c1 = "#1e3c2f"; c2 = "#2d6945"; c3 = "#0f3d24"; // 초록빛 보라
    } else if (element === "fire") {
        document.documentElement.style.setProperty('--primary-color', '#ff6b6b');
        c1 = "#3c1e1e"; c2 = "#692d2d"; c3 = "#3d0f0f"; // 붉은빛 보라
    } else if (element === "earth") {
        document.documentElement.style.setProperty('--primary-color', '#f1c40f');
        c1 = "#3c381e"; c2 = "#69602d"; c3 = "#3d350f"; // 황금빛 보라
    } else if (element === "metal") {
        document.documentElement.style.setProperty('--primary-color', '#bdc3c7');
        c1 = "#2c3e50"; c2 = "#4a5a6a"; c3 = "#1c252e"; // 회색빛 보라
    } else if (element === "water") {
        document.documentElement.style.setProperty('--primary-color', '#3498db');
        c1 = "#15243b"; c2 = "#1e3a5f"; c3 = "#0c1524"; // 푸른빛 보라
    } else {
        document.documentElement.style.setProperty('--primary-color', '#54a0ff');
    }

    document.body.style.setProperty('--bg-c1', c1);
    document.body.style.setProperty('--bg-c2', c2);
    document.body.style.setProperty('--bg-c3', c3);
}

function updateOhaengChart(pillars) {
    const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    Object.values(pillars).forEach(p => {
        if (p.s !== "모") {
            const sEl = getColorClass(p.s);
            if (sEl) counts[sEl]++;
        }
        if (p.b !== "름") {
            const bEl = getColorClass(p.b);
            if (bEl) counts[bEl]++;
        }
    });

    const canvas = document.getElementById('ohaengRadarChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width * 0.28; // 크기를 줄여서 상단 이모지 잘림 방지

    ctx.clearRect(0, 0, width, height);

    const labels = ["wood", "fire", "earth", "metal", "water"];
    const emojis = { wood: "🌳", fire: "🔥", earth: "⛰️", metal: "⚔️", water: "🌊" };
    const hanjas = { wood: "(木)", fire: "(火)", earth: "(土)", metal: "(金)", water: "(水)" };
    const angles = labels.map((_, i) => (Math.PI * 2 / 5) * i - Math.PI / 2);

    // 1. 그리드 그리기 (오각형 배경)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let level = 1; level <= 4; level++) {
        ctx.beginPath();
        const r = (radius / 4) * level;
        angles.forEach((angle, i) => {
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
    }

    // 2. 축 선 그리기
    angles.forEach(angle => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        ctx.stroke();
    });

    // 3. 데이터 플롯 그리기
    ctx.beginPath();
    ctx.fillStyle = "rgba(84, 160, 255, 0.4)";
    ctx.strokeStyle = "rgba(84, 160, 255, 0.8)";
    ctx.lineWidth = 3;
    const minR = 0.15; // 값이 0이어도 최소 15% 크기는 유지 (뾰족함 방지)
    angles.forEach((angle, i) => {
        const count = counts[labels[i]];
        const val = Math.min(count, 4);
        // 0~4 값을 minR ~ 1.0 범위로 매핑
        const r = radius * (minR + (1 - minR) * (val / 4));

        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. 이모지 라벨 그리기
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    angles.forEach((angle, i) => {
        const r = radius + 32; // 공간 확보를 위해 살짝 조정
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        // 이모지 표시
        ctx.font = "24px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(emojis[labels[i]], x, y - 12);

        // 한자 표시 (괄호 포함)
        ctx.font = "12px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillText(hanjas[labels[i]], x, y + 12);

        // 숫자 표시
        ctx.font = "11px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillText(counts[labels[i]], x, y + 28);
    });
}

function updateResultTexts() {
    if (!lastResultData || !currentPillars) return;
    const { name, gender, year, month, day, pillars } = lastResultData;
    const isMale = gender === 'male';
    const lang = currentLang;

    // Maps
    // Maps
    const currentLoveMap = lang === 'en' ? (isMale ? loveMapMale_en : loveMapFemale_en) : (isMale ? loveMapMale : loveMapFemale);
    const currentNatureMap = lang === 'en' ? (isMale ? natureMapMale_en : natureMapFemale_en) : (isMale ? natureMapMale : natureMapFemale);
    const currentFortuneMap = lang === 'en' ? fortune2026Map_en : fortune2026Map;
    const currentWealthMap = lang === 'en' ? wealthMap_en : wealthMap;
    const currentHealthMap = lang === 'en' ? healthMap_en : healthMap;
    const currentStudyMap = lang === 'en' ? studyMap_en : studyMap;

    // Title & Desc
    const today = new Date();
    let age = today.getFullYear() - year;
    const m = today.getMonth() - (month - 1);
    if (m < 0 || (m === 0 && today.getDate() < day)) age--;

    if (lang === 'en') {
        document.getElementById('result-name-title').innerText = `${name}'s Fortune`;
        document.getElementById('result-desc').innerText = `Born ${year}.${month}.${day} (Age ${age}) | ${pillars.day.s}${pillars.day.b}`;
    } else {
        document.getElementById('result-name-title').innerText = `${name}님 사주 리포트`;
        const genderText = gender === 'male' ? '남' : '여';
        document.getElementById('result-desc').innerText = `${year}.${month}.${day}생 (만 ${age}세, ${genderText}) | ${pillars.day.s}${pillars.day.b}일주`;
    }

    // Texts
    const dStem = pillars.day.s;
    const sMap = lang === 'en' ? stemReadings_en : stemReadings_ko;
    document.getElementById('nature-text').innerHTML = `<span class="nature-badge">${dStem}(${sMap[dStem]})</span><br><br>${currentNatureMap[dStem] || ""}`;
    document.getElementById('fortune-text').innerHTML = currentFortuneMap[dStem] || "";
    document.getElementById('love-text').innerHTML = currentLoveMap[dStem] || "";
    document.getElementById('wealth-text').innerHTML = currentWealthMap[dStem] || "";
    document.getElementById('health-text').innerHTML = currentHealthMap[dStem] || "";
    document.getElementById('study-text').innerHTML = currentStudyMap[dStem] || "";

    // Update Pillars (to refresh language)
    if (pillars) {
        document.getElementById('year-pillar').innerHTML = getColoredHtml(pillars.year.s, pillars.year.b);
        document.getElementById('month-pillar').innerHTML = getColoredHtml(pillars.month.s, pillars.month.b);
        document.getElementById('day-pillar').innerHTML = getColoredHtml(pillars.day.s, pillars.day.b);
        document.getElementById('hour-pillar').innerHTML = getColoredHtml(pillars.hour.s, pillars.hour.b);
    }

    // Refresh current tab detail
    const activeTab = document.querySelector('.mini-col.active');
    if (activeTab) {
        showTabDetail(activeTab.id.split('-')[1]);
    }

    // Update share button text
    const shareBtn = document.querySelector('.result-share .btn-content');
    if (shareBtn) {
        shareBtn.innerHTML = `
            <div class="btn-text" style="align-items: center; text-align: center; width: 100%;">
                <span class="main-text" style="font-size: 1.1rem; margin-bottom: 4px;">${TRANSLATIONS[lang].share_result_desc}</span>
                <span class="sub-text">${TRANSLATIONS[lang].share_result_title}</span>
            </div>
        `;
    }
}

function showSajuResult(data) {
    lastResultData = data;
    const { name, gender, year, month, day, pillars } = data;
    document.getElementById('input-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    window.scrollTo(0, 0);

    // 만 나이 계산
    const today = new Date();
    let age = today.getFullYear() - year;
    const m = today.getMonth() - (month - 1);
    if (m < 0 || (m === 0 && today.getDate() < day)) {
        age--;
    }

    document.getElementById('result-name-title').innerText = `${name}님 사주 리포트`;
    const genderText = gender === 'male' ? '남' : '여';
    document.getElementById('result-desc').innerText = `${year}.${month}.${day}생 (만 ${age}세, ${genderText}) | ${pillars.day.s}${pillars.day.b}일주`;

    updateResultTexts(); // Use the unified function to handle language and text updates correctly

    // 기둥 업데이트 (Hanja)
    document.getElementById('year-pillar').innerHTML = getColoredHtml(pillars.year.s, pillars.year.b);
    document.getElementById('month-pillar').innerHTML = getColoredHtml(pillars.month.s, pillars.month.b);
    document.getElementById('day-pillar').innerHTML = getColoredHtml(pillars.day.s, pillars.day.b);
    document.getElementById('hour-pillar').innerHTML = getColoredHtml(pillars.hour.s, pillars.hour.b);



    updateBackground(pillars.day.s);
    updateOhaengChart(pillars);
    showTabDetail('day');
    switchSubTab('love');

    // 공유 버튼 텍스트 업데이트
    const shareBtn = document.querySelector('.result-share .btn-content');
    if (shareBtn) {
        shareBtn.innerHTML = `
            <div class="btn-text" style="align-items: center; text-align: center; width: 100%;">
                <span class="main-text" style="font-size: 1.1rem; margin-bottom: 4px;">${TRANSLATIONS[currentLang].share_result_desc}</span>
                <span class="sub-text">${TRANSLATIONS[currentLang].share_result_title}</span>
            </div>
        `;
    }
}

function showTabDetail(type) {
    if (!currentPillars) return;
    const data = currentPillars[type];
    const lang = currentLang;

    document.querySelectorAll('.mini-col').forEach(c => c.classList.remove('active'));
    document.getElementById(`col-${type}`).classList.add('active');

    // 배경색 전환
    if (data.s !== '모') {
        updateBackground(data.s);
    }

    const titleEl = document.getElementById('detail-title');
    const bodyEl = document.getElementById('detail-body');
    // Select Map
    const interpMap = lang === 'en' ? pillarInterpretations_en : pillarInterpretations;
    const interp = interpMap[data.s] || {};

    let titleText = "";
    let bodyHtml = "";

    if (type === 'hour' && data.s === '모') {
        titleText = lang === 'en' ? "Hour (Time): Unknown" : "시주(시간): 정보 없음";
        if (lang === 'en') {
            bodyHtml = `
            <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-top:10px;">
                <h4 style="color:#ffd700; margin-top:0;">❓ Is it okay if time is unknown?</h4>
                <p style="font-size:0.9rem; line-height:1.6; margin-bottom:10px;">
                    Strictly speaking, we handle it as 'Three Pillars' analysis. But don't worry!
                </p>
                <ul style="font-size:0.85rem; padding-left:20px; line-height:1.7; opacity:0.9;">
                    <li><strong>Flow of Luck:</strong> The major flow of life leads can be analyzed with Year, Month, and Day.</li>
                    <li><strong>Late Life/Children:</strong> Hour pillar symbolizes life after 50s and relationship with children.</li>
                    <li><strong>Supplement:</strong> 80% of core analysis including innate nature and 2026 fortune is already covered.</li>
                </ul>
                <p style="font-size:0.85rem; margin-top:10px; color:var(--primary-color);">* If you find out the exact time later, input again to see the full result!</p>
            </div>
        `;
        } else {
            bodyHtml = `
            <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-top:10px;">
                <h4 style="color:#ffd700; margin-top:0;">❓ 시간을 몰라도 괜찮나요?</h4>
                <p style="font-size:0.9rem; line-height:1.6; margin-bottom:10px;">
                    엄밀히 따지면 태어난 시간을 모를 경우, 네 개의 기둥(사주) 중 세 개만 보는 <strong>'삼주(三柱)'</strong>를 분석하게 됩니다. 하지만 실망하실 필요는 없습니다!
                </p>
                <ul style="font-size:0.85rem; padding-left:20px; line-height:1.7; opacity:0.9;">
                    <li><strong>운의 흐름:</strong> 인생의 큰 흐름인 '대운(大運)'은 년, 월, 일만으로도 충분히 파악이 가능합니다.</li>
                    <li><strong>말년운/자식운:</strong> 시주(時柱)는 주로 50대 이후의 노후 삶과 자식과의 인연을 상징합니다.</li>
                    <li><strong>보완 가능:</strong> 현재의 기질과 2026년 신년 운세 등 핵심적인 내용은 이미 삼주 안에 80% 이상 담겨 있습니다.</li>
                </ul>
                <p style="font-size:0.85rem; margin-top:10px; color:var(--primary-color);">* 정확한 시간을 나중에 알게 되시면 다시 입력하여 보완된 결과를 확인해 보세요!</p>
            </div>
        `;
        }
    } else {
        const labels = lang === 'en' ?
            { year: "Year Pillar (Root)", month: "Month Pillar (Society)", day: "Day Pillar (Self)", hour: "Hour Pillar (Future)" } :
            { year: "년주(뿌리)", month: "월주(사회)", day: "일주(나)", hour: "시주(미래)" };

        titleText = `${labels[type]}: ${data.s}${data.b}`;
        const detail = interp[type] || (lang === 'en' ? "Energy is harmonious." : "기운이 조화롭습니다.");
        const keyword = interp.keyword || "";
        bodyHtml = `<div style="background:rgba(255,215,0,0.05); padding:12px; border-radius:10px; margin-bottom:12px; font-weight:bold; color:#ffd700;">${keyword}</div><p>${detail}</p>`;
    }

    titleEl.innerText = titleText;
    bodyEl.innerHTML = bodyHtml;
    document.getElementById('tab-detail-display').style.display = 'block';
}






function switchSubTab(tab) {
    // 상세 분석 뷰들(love, wealth, health, study)만 토글
    const tabs = ['love', 'wealth', 'health', 'study'];
    tabs.forEach(t => {
        document.getElementById(`view-${t}`).style.display = 'none';
        document.getElementById(`btn-${t}`).classList.remove('active');
    });

    document.getElementById(`view-${tab}`).style.display = 'block';
    document.getElementById(`btn-${tab}`).classList.add('active');
}

function goBack() {
    updateBackground(null); // 기본 배경으로 복구
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('input-screen').style.display = 'flex';
}

async function shareResult() {
    if (!lastResultData) return;
    const { name, gender, pillars } = lastResultData;
    const dStem = pillars.day.s;
    const dBranch = pillars.day.b;
    const reading = `${dStem}${dBranch}(${stemReadings[dStem]}${branchReadings[dBranch]})`;
    const lang = currentLang;
    const isMale = gender === 'male';
    const natureMap = lang === 'en' ? (isMale ? natureMapMale_en : natureMapFemale_en) : (isMale ? natureMapMale : natureMapFemale);

    let shareTitle, shareText, successMsg;

    if (lang === 'en') {
        shareTitle = "Fortune Analysis Report";
        const nature = natureMap[dStem].split('.')[0];
        shareText = `🦄 [${name}]'s Innate Nature?\n\n` +
            `🔖 Energy: ${reading}\n` +
            `"${nature}"\n\n` +
            `💬 "Wow... this is so accurate! 😲"\n` +
            `Curious about your 2026 fortune? 👇`;
        successMsg = "Result copied! ✨";
    } else {
        shareTitle = "사주 분석 리포트";
        const nature = natureMap[dStem].split('.')[0];
        shareText = `🦄 [${name}]님의 타고난 본캐는?\n\n` +
            `🔖 타고난 기운: ${reading}\n` +
            `"${nature}"\n\n` +
            `💬 "와... 소름 돋게 맞는데? 😲"\n` +
            `내 2026년 운세가 궁금하다면? 👇`;
        successMsg = "결과가 복사되었습니다! ✨";
    }

    const shareData = {
        title: shareTitle,
        text: shareText,
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Web Share API 미지원 시 클립보드 복사
            await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
            showToast(TRANSLATIONS[currentLang].toast_copy);
        }
    } catch (err) {
        console.error('Share failed:', err);
        showToast(TRANSLATIONS[currentLang].toast_share_fail);
    }
}


async function shareApp() {
    const lang = currentLang;
    let shareTitle, shareText, successMsg;

    if (lang === 'en') {
        shareTitle = "2026 Fortune Analysis";
        shareText = `🔮 How is my destiny in 2026?\n\n` +
            `Shockingly accurate! 😱\n` +
            `From innate nature to fortune flow\n` +
            `Get your full analysis for free. ✨\n\n` +
            `👇 Check your Saju in 1 minute`;
        successMsg = "Link copied! ✨";
    } else {
        shareTitle = "2026년 나의 사주";
        shareText = `🔮 2026년 내 운명은 어떨까?\n\n` +
            `소름 돋는 정확도! 😱\n` +
            `나의 타고난 성향부터 대운의 흐름까지\n` +
            `무료로 완벽하게 분석해 드려요. ✨\n\n` +
            `👇 1분 만에 내 사주 확인하기`;
        successMsg = "링크가 복사되었습니다! ✨";
    }

    const shareData = {
        title: shareTitle,
        text: shareText,
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
            showToast(TRANSLATIONS[currentLang].toast_copy);
        }
    } catch (err) {
        console.error('App share failed:', err);
        showToast(TRANSLATIONS[currentLang].toast_share_fail);
    }
}


function showToast(message) {
    const msgEl = document.getElementById('toast-message');
    if (!msgEl) return;

    msgEl.innerText = message;
    msgEl.classList.add('show');

    setTimeout(() => {
        msgEl.classList.remove('show');
    }, 2500);
}


// --- 웹 오디오 API를 이용한 배경음악 생성 ---

let audioCtx = null;
let isPlaying = false;
let nextNoteTime = 0;
let soundTimer = null;

// 동양적인 느낌의 5음계 (Pentatonic Scale)
// C4, D4, E4, G4, A4, C5...
const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playNote() {
    if (!isPlaying) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // 부드러운 사인파 (풍경 소리 느낌)
    osc.type = 'sine';

    // 랜덤 음계 선택
    const note = scale[Math.floor(Math.random() * scale.length)];
    // 약간의 피치 변화로 자연스러움 추가
    const detune = (Math.random() - 0.5) * 10;

    osc.frequency.value = note + detune;

    // 엔벨로프 (부드럽게 시작해서 길게 사라짐)
    const now = audioCtx.currentTime;
    const attack = 0.05;
    const release = 4.0; // 긴 여운

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + attack); // 볼륨을 너무 크지 않게
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + release);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + attack + release);

    // 다음 음 재생 스케줄링 (랜덤 간격)
    const delay = 1000 + Math.random() * 3000; // 1~4초 간격
    soundTimer = setTimeout(playNote, delay);
}

function toggleSound() {
    const btn = document.getElementById('sound-btn');

    if (isPlaying) {
        // 끄기
        isPlaying = false;
        if (soundTimer) clearTimeout(soundTimer);
        if (audioCtx) audioCtx.suspend();
        btn.innerText = '🔇';
        btn.classList.remove('playing');
    } else {
        // 켜기
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        isPlaying = true;
        playNote(); // 첫 음 재생
        btn.innerText = '🔊';
        btn.classList.add('playing');
    }
}

// --- 🇺🇸 English Interpretation Maps ---

const natureMapMale_en = {
    "甲": "You are like a tall, straight tree 🌲. You possess a strong mentality that remains unshaken even in storms. <br><br>Though you may seem reserved on the outside, a strong desire for 'growth' and 'pride' burns within. You dislike being ordered around and shine brightest when leading. <br><br><strong>💡 Tip:</strong> You are like a sturdy bamboo. Sometimes, learning to bend slightly like a reed is wisdom you need.",
    "乙": "You are a vine with tenacious vitality 🌿. Whether a rose or a weed, you survive anywhere. You appear soft on the outside but possess a scary persistence inside. <br><br>Your adaptability is second to none. Like the wind that lies down and rises again, you are a master of survival. <br><br><strong>💡 Tip:</strong> You are practical and social. Your delicate observation skills help you make the best choices.",
    "丙": "You are the Sun in the sky ☀️. Your presence is undeniable and brilliant. You are passionate, active, and love to share with others. <br><br>You are honest and cannot hide your emotions. You value manners and justice, but your temper can flare up. <br><br><strong>💡 Tip:</strong> You are a mood maker. If you can control your sudden anger, you will be respected by all like the warm sun.",
    "丁": "You are like a candle or moonlight 🕯️. Quiet and calm on the outside, but holding a furnace of passion inside. You are a 'craftsman' type who focuses intensely on what you love. <br><br>You are sensitive and empathetic, taking care of others like a mother. <br><br><strong>💡 Tip:</strong> You tend to hold grudges. Try to let go of hurt feelings. You have a gentle but deep charisma.",
    "戊": "You are a magnificent mountain ⛰️. Reliable and trustworthy, people naturally lean on you. You are heavy and serious, keeping secrets well. <br><br>You embrace various people, but you can be stubborn and dislike change. <br><br><strong>💡 Tip:</strong> Once you decide, you don't change your mind. Showing some flexibility can lead you to greater achievements.",
    "己": "You are fertile soil 🌱. You may look simple, but you have the talent to nurture life. You prefer stable and practical paths over reckless challenges. <br><br>You are quick-witted and good at social life. You take care of your own interests while matching others. <br><br><strong>💡 Tip:</strong> You are detailed and caring. Try not to be too suspicious of opportunities. You are a practical realist.",
    "庚": "You are raw metal or a sword ⚔️. You have powerful charisma and decisiveness. You value loyalty above all and are a 'man's man' who takes responsibility. <br><br>You like to break old customs and create new orders. <br><br><strong>💡 Tip:</strong> You can be too strong and break. Learning soft conversation skills will smooth your relationships.",
    "辛": "You are a shining jewel 💎. You are delicate, sharp, and seek perfection. You care about your image and have excellent aesthetic sense. <br><br>You have high self-esteem and dislike interference. <br><br><strong>💡 Tip:</strong> You can be cold when hurt. Your ability to shine is unmatched. You are a sophisticated perfectionist.",
    "壬": "You are a vast ocean 🌊. You have a broad mind and innate wisdom. You are a free spirit who flows like water and adapts to any situation. <br><br>You are ambitious and often connected to overseas opportunities. <br><br><strong>💡 Tip:</strong> You are mysterious and hard to read. Sometimes showing your true heart is necessary. You are a strategist with a big scale.",
    "癸": "You are spring rain or a stream 🌧️. You are pure, sensitive, and empathetic. You have brilliant ideas and imagination that surprise others. <br><br>Like water dripping through rock, you have incredible patience. <br><br><strong>💡 Tip:</strong> You can be moody. Practicing expressing your feelings honestly is good. You are a creative idea bank."
};

const natureMapFemale_en = {
    "甲": "You are a career woman like a straight tree 🌲. You have high self-esteem and distinct subjectivity. You are a strong woman who leads rather than relies on others. <br><br>You are just and principled. <br><br><strong>💡 Tip:</strong> Sometimes, being soft is stronger than being hard. You are a leader who leads with confidence.",
    "乙": "You are a beautiful flower 🌸. You have great adaptability and charm that captures hearts. Soft on the outside, but tough on the inside. <br><br>You are a survivor with wisdom and flexibility. <br><br><strong>💡 Tip:</strong> You are realistic and practical. Your soft charisma naturally leads people.",
    "丙": "You are the passionate Sun ☀️. You like to lead the atmosphere like a queen. You are honest, active, and love to give. <br><br>You have a strong sense of justice and cannot stand unfairness. <br><br><strong>💡 Tip:</strong> You are a mood maker. Controlling your temper makes you even more perfect.",
    "丁": "You are elegant moonlight 🌙. You are caring and warm. Quiet on the outside, but passionate inside. <br><br>You have a craftsman spirit and are sensitive to others' pain. <br><br><strong>💡 Tip:</strong> Don't hold grudges for too long. Your quiet charisma is elegant and deep.",
    "戊": "You are a broad mountain ⛰️. You have a wide heart that embraces everyone. You are reliable and trustworthy. <br><br>You are realistic and responsible, perfect for building a stable family. <br><br><strong>💡 Tip:</strong> Being too stubborn can block you. Being flexible will make you even better.",
    "己": "You are the rich earth 🌾. You are a practical leader who takes care of substance and people. You are multi-talented and quick-witted. <br><br>You find joy in nurturing others. <br><br><strong>💡 Tip:</strong> You are wise and frugal. You have the best qualities as a spouse and mother.",
    "庚": "You are a decisive heroine ⚔️. You solve complex problems at once and value loyalty. You are a reformer who likes new things. <br><br>You are clear about what is right and wrong. <br><br><strong>💡 Tip:</strong> Your strong assertion can cause friction. Soft speech will make you a perfect leader.",
    "辛": "You are a shining jewel 💎. You are delicate, aesthetic, and always maintain a sophisticated image. <br><br>You have high standards and are sensitive. <br><br><strong>💡 Tip:</strong> Let go of perfectionism a little for a more comfortable life. You are like an elegant princess.",
    "壬": "You are a deep lake 🌊. You are mysterious, wise, and have great insight. You accept everything with a broad mind. <br><br>You are a free spirit with a large scale of thinking. <br><br><strong>💡 Tip:</strong> You are an intellectual woman who constantly explores new worlds.",
    "癸": "You are warm spring rain 🌧️. You have excellent empathy and are clever. You are pure and sensitive to others' emotions. <br><br>You have brilliant ideas and imagination. <br><br><strong>💡 Tip:</strong> Express your feelings honestly. You are a woman with pure and creative charm."
};

const loveMapMale_en = {
    "甲": "To you, love is a 'precious flower to protect'. You are a reliable shade for your person. <br><br>You are direct in expression and devoted. <br><br><strong>💡 Love Tip:</strong> You like a partner you can respect. Sometimes a soft word strengthens the relationship.",
    "乙": "You are a delicate and sweet lover. You notice subtle emotional changes well. You give comfort like a friend. <br><br>You have strong jealousy and possessiveness inside. <br><br><strong>💡 Love Tip:</strong> Maintain your own hobbies to be independent. You have the power to continue relationships steadily.",
    "丙": "You love passionately like fire. You fall in love at first sight and express affections boldly. <br><br>You can cool down quickly, so effort is needed for long-term relationships. <br><br><strong>💡 Love Tip:</strong> Listen to your partner more. You are a mood maker who delights your lover.",
    "丁": "You love quietly like a lamp. You prefer love that permeates slowly over time. You remember small details. <br><br>You are single-minded but can hold grudges inside. <br><br><strong>💡 Love Tip:</strong> Solve feelings through conversation. You have a maternal/paternal charm.",
    "戊": "You are a reliable rock-like lover. You are not good at sweet words but show love through actions. You prefer serious relationships. <br><br>You can be stubborn and frustrating. <br><br><strong>💡 Love Tip:</strong> Express your heart with small gifts. You give great trust with stability.",
    "己": "You love like an embracing earth. You take care of your partner frugally. You value practical and helpful relationships. <br><br>You take time to open your heart but become very close. <br><br><strong>💡 Love Tip:</strong> Opening your heart helps. You have a great ability to make your partner comfortable.",
    "庚": "You are a charismatic leader type. You dislike ambiguous relationships and take responsibility for your people. <br><br>You are too strong and blunt which can hurt others. <br><br><strong>💡 Love Tip:</strong> Soften your stubbornness. Listening to your partner is necessary.",
    "辛": "You are a romanticist with delicate taste. You have high standards for style and manners. <br><br>You are sensitive and can be easily hurt. <br><br><strong>💡 Love Tip:</strong> You need a partner who empathizes with your sensitivity. Let go of perfectionism for comfort.",
    "壬": "You are a free spirit like the sea. You dislike being bound and want a cool relationship respecting privacy. <br><br>You value mental connection over physical. <br><br><strong>💡 Love Tip:</strong> Show your sincerity sometimes. You match well with international connections.",
    "癸": "You love sweetly like spring rain. You have strong maternal love and want to be loved like a child. <br><br>You match your partner's mood well but have mood swings. <br><br><strong>💡 Love Tip:</strong> Emotional communion is key. You capture hearts with protective instincts."
};

const loveMapFemale_en = {
    "甲": "You are attracted to dignified people you can learn from. You are independent and lead the relationship. <br><br>You want an equal relationship of mutual respect. <br><br><strong>💡 Love Tip:</strong> Showing soft sides helps. You are a career woman style.",
    "乙": "You have a great desire to be loved. You stimulate protective instincts. You are delicate and sweet. <br><br>You have strong jealousy inside. <br><br><strong>💡 Love Tip:</strong> Beware of obsession. Showing independence makes the relationship healthier.",
    "丙": "You love brightly like the sun. You are popular and express emotions honestly. <br><br>You are passionate but can be hot-tempered. <br><br><strong>💡 Love Tip:</strong> Listen to your partner. You are a mood maker who prefers cool relationships.",
    "丁": "You are elegant and mysterious like moonlight. You find joy in taking care of your partner. <br><br>You are single-minded but can hold grudges. <br><br><strong>💡 Love Tip:</strong> Express your feelings honestly. You melt hearts with deep love.",
    "戊": "You want a reliable and stable partner. You prefer serious relationships leading to marriage. <br><br>You are trustworthy and realistic. <br><br><strong>💡 Love Tip:</strong> Bending your stubbornness smoothes things. You give family-like comfort.",
    "己": "You are a mom-like lover who takes care of everything. You have the best qualities as a spouse. <br><br>You value practical relationships. <br><br><strong>💡 Love Tip:</strong>Avoid nagging too much. You are excellent at building a stable family.",
    "庚": "You are a loyal and decisive strong woman. You resolve complex matters at once. <br><br>You are reformative and responsible. <br><br><strong>💡 Love Tip:</strong> Show the warmth hidden inside. Soft conversation is needed.",
    "辛": "You are elegant and high-self-esteem. You prefer partners who treat you strictly. <br><br>You have high standards and are sensitive. <br><br><strong>💡 Love Tip:</strong> You need a partner who empathizes. You are attracted to those who make you shine.",
    "壬": "You are wise and insightful. You match well with free spirits. <br><br>You value mental connection and conversation. <br><br><strong>💡 Love Tip:</strong> You have mysterious charm. You seek large-scale love.",
    "癸": "You love kindly like spring rain. You have strong maternal love and act cute. <br><br>You are sensitive to your partner's mood. <br><br><strong>💡 Love Tip:</strong> Control your mood swings. You capture hearts with mysterious charm."
};

const fortune2026Map_en = {
    "甲": "2026 is a year for your talents to bloom 🌸. The Sun shines on the Tree, revealing your preparations to the world. <br><br>Your desire to express yourself increases. <br><br><strong>💡 Lucky Tip:</strong> Promote your ideas actively. SNS or YouTube is good.",
    "乙": "A splendid year like the highlight of life ✨. Your charm spreads, and you get a stage to show off. <br><br>Artistic activities can hit the jackpot. <br><br><strong>💡 Lucky Tip:</strong> Fancy clothes or accessories bring luck.",
    "丙": "A year of burning competition 🔥. You can achieve great things through cooperation or face fierce competition. <br><br>Focus on gaining honor or people rather than money. <br><br><strong>💡 Lucky Tip:</strong> Value teamwork over independent action.",
    "丁": "A time to meet strong helpers 🤝. It seems like your light is lost in the sun, but it's a chance to grow your power. <br><br>Get help from others for difficult tasks. <br><br><strong>💡 Lucky Tip:</strong> Giving to others returns as great blessing.",
    "戊": "A great year for documents and studies 📚. The sun shines on your vast land. Good for contracts, exams, and promotions. <br><br>You build a stable foundation with help. <br><br><strong>💡 Lucky Tip:</strong> Review important contracts carefully.",
    "己": "A honest year where you get rewarded for efforts 🎁. Your skills and status become solid like pottery fired in a kiln. <br><br>Academic achievements follow. <br><br><strong>💡 Lucky Tip:</strong> Challenge yourself with new learning or certifications.",
    "庚": "Career and honor luck rises 🏆. The strong fire refines you into a fine sword. Big changes in career like promotion or job change. <br><br>Manage stress well. <br><br><strong>💡 Lucky Tip:</strong> Manage stamina with regular exercise.",
    "辛": "New love or recognition comes 💖. You shine brightly receiving the spotlight. <br><br>Avoid greed or emotional responses. <br><br><strong>💡 Lucky Tip:</strong> Avoid red-colored accessories if possible.",
    "壬": "Dynamic financial luck flows 💸. Money comes and goes like steam. Good for business expansion or investment, but manage risks. <br><br>Windfall is possible but greed brings disaster. <br><br><strong>💡 Lucky Tip:</strong> No investment without thorough analysis.",
    "癸": "Stable income and results follow 🏠. Like rain cooling the heat, you are welcomed everywhere. <br><br>Good for accumulating assets steadily. <br><br><strong>💡 Lucky Tip:</strong> Stable asset management like savings is good."
};

const wealthMap_en = {
    "甲": "Wealth is 'Earth' to you. Like rooting in a vast land, you are good at real estate or stable asset management. <br><br><strong>💡 Wealth Tip:</strong> Instead of aiming for a jackpot, steady accumulation builds a mountain. Investing in your own value brings wealth. Generosity returns as fortune.",
    "乙": "Wealth is 'Fertile Land' to you. You have excellent ability to gather wealth steadily like grass covering a field. You are good at information and realistic investments. <br><br><strong>💡 Wealth Tip:</strong> You gain more substance when deciding alone rather than in partnership. You have strong survival skills for building wealth.",
    "丙": "Wealth is 'Metal' to you. Like smelting metal in a furnace, you can make a fortune with bold and large-scale investments. <br><br><strong>💡 Wealth Tip:</strong> You have strong decisiveness but need risk management. Focus on the sense of achievement rather than obsession with money.",
    "丁": "Wealth is a 'Shining Jewel' to you. You are strong in delicate and meticulous asset management. You prefer stable and certain returns. <br><br><strong>💡 Wealth Tip:</strong> You save small expenses to make big money. Your professional knowledge or certifications become stable assets.",
    "戊": "Wealth is 'Clear Water' to you. You have a fortune where wealth flows in endlessly like a spring. You are excellent at keeping and defending money. <br><br><strong>💡 Wealth Tip:</strong> You shine in distribution or flow-based businesses. Letting go of stubbornness and following trends can make you huge wealth.",
    "己": "Wealth is the 'Vast Ocean' to you. Like water flowing to the sea, you have the power to attract wealth from various paths. People bring you money. <br><br><strong>💡 Wealth Tip:</strong> Systems like rental or passive income suit you well. You hide big ambitions inside a modest exterior.",
    "庚": "Wealth is a 'Green Tree' to you. Like crafting furniture from wood, you are good at creating value from raw materials. You are result-oriented. <br><br><strong>💡 Wealth Tip:</strong> You often succeed by self-made efforts. Be careful of losing money due to loyalty to friends. Distinguish public and private matters.",
    "辛": "Wealth is 'Plants and Forests' to you. You gain wealth in sensitive and sensory fields. You have high taste and are good at investing in trends or art. <br><br><strong>💡 Wealth Tip:</strong> High risk, high return. Utilizing your personal brand and charm brings great income. Connections are your assets.",
    "壬": "Wealth is 'Hot Fire' to you. Your wealth luck is dynamic and changeable like steam. You can build wealth in cross-border business or online. <br><br><strong>💡 Wealth Tip:</strong> The more you move, the more money piles up. You have a natural talent for negotiation and improvisation.",
    "癸": "Wealth is a 'Soft Lamp' to you. You accumulate wealth quietly and substantially. You are strong in income using ideas or intellectual property. <br><br><strong>💡 Wealth Tip:</strong> You are good at making seed money through detailed analysis. Patience and long-term investment bring the biggest fruits."
};

const healthMap_en = {
    "甲": "You have the surging energy of a tree. Watch your gallbladder and nervous system. Stress can cause migraines or muscle pain. <br><br><strong>💡 Health Tip:</strong> Active exercise like hiking helps. Sour fruits and green vegetables are good for you.",
    "乙": "You have flexible plant energy. Watch your liver and peripheral circulation (numbness). Keep your joints warm. <br><br><strong>💡 Health Tip:</strong> Yoga or Pilates is best for flexibility. Stretching should be a daily habit.",
    "丙": "You have intense sun energy. Watch your cardiovascular system and eyes. Heat rises easily causing insomnia. <br><br><strong>💡 Health Tip:</strong> Avoid spicy/hot food. Eat bitter greens. Avoiding smartphones at night protects your eyes and sleep.",
    "丁": "You have subtle lamp energy. Your heart and small intestine are sensitive. Stress shows up physically immediately. <br><br><strong>💡 Health Tip:</strong> Quiet meditation or tea time is essential. Red grains (red bean, sorghum) help. Regular sleep is the best medicine.",
    "戊": "You have reliable mountain energy, but your stomach and digestive system can be weak. Indigestion leads to skin trouble. <br><br><strong>💡 Health Tip:</strong> Regular eating habits are a must. Abdominal massage and yellow foods (pumpkin, sweet potato) represent your energy.",
    "己": "You have fertile garden energy. Your spleen and stomach are sensitive. Too much thinking causes indigestion. <br><br><strong>💡 Health Tip:</strong> Keep your belly warm. Ginger tea is good. Walking barefoot on soil (Earthing) works wonders.",
    "庚": "You have hard rock energy. Lung and large intestine health is key. Dryness hurts your respiratory system. <br><br><strong>💡 Health Tip:</strong> Hydration and humidity control are essential. White vegetables (radish, pear) help. Cardio increases lung capacity.",
    "辛": "You have delicate jewel energy. Your respiratory system and skin are very sensitive to environment/dust. <br><br><strong>💡 Health Tip:</strong> Ventilate often and keep bedding clean. Avoid harsh cosmetics. Spicy food like garlic helps immunity.",
    "壬": "You have vast ocean energy. Watch your kidney, bladder, and circulation. Swelling indicates waste accumulation. <br><br><strong>💡 Health Tip:</strong> Low-salt diet and drinking water. Swimming or half-bath helps detoxify your body.",
    "癸": "You have clear spring energy. Watch your kidney function and blood circulation. Cold body is your enemy. <br><br><strong>💡 Health Tip:</strong> Keep your lower body warm. Foot baths are recommended. Black foods (black beans, sesame) boost your energy."
};

const studyMap_en = {
    "甲": "You are goal-oriented. You focus best when you have clear motivation. You learn best when you plan and lead rather than being ordered. <br><br><strong>💡 Study Tip:</strong> Read success stories or study in a competitive environment. The goal of 'becoming a leader' moves you.",
    "乙": "You have flexible and creative thinking. Application over rote memorization works for you. <br><br><strong>💡 Study Tip:</strong> Share ideas in study groups or use mind maps. Nice stationery and a pleasant environment boost your mood.",
    "丙": "You are energetic and visual. 'Short-term intense focus' suits you better than sitting long hours boringly. <br><br><strong>💡 Study Tip:</strong> Watch lectures at 1.25x speed or use colorful highlighters. Explaining what you learned to others makes it yours.",
    "丁": "You are optimized for deep and detailed study. You perform best in quiet places like libraries digging into one topic. <br><br><strong>💡 Study Tip:</strong> Use late night or dawn. Making your own meticulous summary notes is the best learning process.",
    "戊": "You have endurance and steadiness. You might start slow but overtake everyone at the end with persistence. <br><br><strong>💡 Study Tip:</strong> Macro approach understanding the big picture first. Believe that 'consistency beats genius'.",
    "己": "You are excellent at recording and organizing. Structuring vast info into your own system perfects your knowledge. <br><br><strong>💡 Study Tip:</strong> Put effort into wrong answer notes. Self-summary time should be 70% vs listening 30%.",
    "庚": "You are strong in logical and analytical thinking. You forget rote memorization but never forget once you understand the 'Why'. <br><br><strong>💡 Study Tip:</strong> Understand the table of contents and causality. Difficult problems ignite your desire to conquer.",
    "辛": "You are a perfectionist who doesn't miss details. You show talent in math requiring precision or languages. <br><br><strong>💡 Study Tip:</strong> Create a solitary, clean environment. Give yourself clear rewards to prevent burnout.",
    "壬": "You have great insight and read the flow. You enjoy connecting contexts like humanities/society rather than memorization. <br><br><strong>💡 Study Tip:</strong> Read foreign books or grand maps. Open libraries or cafes that don't block free thinking are good.",
    "癸": "You have great intuition and ideas. You are often an 'auditory learner' who memorizes well by listening or reciting. <br><br><strong>💡 Study Tip:</strong> Ask questions to grasp principles or meditate before studying. Mental management is key as mood affects grades."
};

const pillarInterpretations_en = {
    "甲": {
        nature_year: "Growing Sapling 🌱", nature_month: "Giant Tree forming a forest 🌳", nature_day: "Upright Big Tree 🌲", nature_hour: "Wise Old Tree 🪵", keyword: "🌱 Growth, 🦁 Leadership, 😤 Pride",
        year: "Stood out with leadership since childhood. Competitive and strove to be number one, with a strong sense of justice.",
        month: "Active in society and plays a key leader role in organizations. Values honor and has a strong sense of responsibility.",
        day: "Unbending pride and powerful drive are the driving forces of life. Like a roly-poly toy, you rise again even after hardships.",
        hour: "In later years, you become a respected teacher or spiritual pillar with accumulated wisdom. You spend your old age constantly learning."
    },
    "乙": {
        nature_year: "Flower swaying in spring breeze 🌸", nature_month: "Vine climbing over a wall 🌿", nature_day: "Persistent Weed/Vine 🌱", nature_hour: "Flowering Plant bearing fruit 🌻", keyword: "🌿 Adaptability, 🧗 Persistence, 💰 Realistic",
        year: "Excellent adaptability and quick wit. Acquired the strength to laugh off difficulties early on.",
        month: "Survives in any organization with flexible social skills. Has great sense for spotting opportunities and tenacity.",
        day: "Flexibility is your greatest weapon, and you know how to be practical. You detour around obstacles to bear fruit.",
        hour: "Enjoy a comfortable old age with deep bonds with children. Find joy in life through small hobbies."
    },
    "丙": {
        nature_year: "Rising Morning Sun 🌅", nature_month: "Hot Midday Sun ☀️", nature_day: "Light illuminating all things ✨", nature_hour: "Setting Sun at Sunset 🌇", keyword: "🔥 Passion, 🙏 Manners, ✨ Splendor",
        year: "A bright child who attracted attention everywhere. Honest with emotions and very affectionate.",
        month: "Captivates the public with eloquence and sociability. Overflowing with energy and prefers fair work processing.",
        day: "Fair and just character. Passionate about everything, holds no grudges, and is popular for being cool.",
        hour: "Lives a life contributing to society with undying passion. Becomes an influential elder followed by those around."
    },
    "丁": {
        nature_year: "Twinkling Starlight ✨", nature_month: "Blazing Bonfire 🔥", nature_day: "Subtle Candlelight 🕯️", nature_hour: "Moonlight in the Night Sky 🌙", keyword: "🕯️ Devotion, 🎀 Delicacy, 🌙 Subtlety",
        year: "A quiet but highly focused child. Rich in sensitivity and shared deep friendships with a few.",
        month: "Recognized for professional knowledge. Strong in details and takes good care of colleagues.",
        day: "Iron hand in a velvet glove type with hot passion inside. Wins people's hearts with silent devotion.",
        hour: "Values spiritual values like religion or philosophy. Spends a noble and dignified later life sharing wisdom."
    },
    "戊": {
        nature_year: "Hill behind the village ⛰️", nature_month: "Magnificent Mountain 🌋", nature_day: "Vast Wilderness 🏜️", nature_hour: "Mountain Range at Sunset 🌄", keyword: "🤝 Trust, 🏔️ Tolerance, 🐂 Stubbornness",
        year: "More mature and serious than peers. A reliable lighthouse-like child whom friends trusted and relied on.",
        month: "Prioritizes credit and holds the center of the organization. Consistently produces results in stable fields.",
        day: "Has unwavering subjectivity and tolerance. Has a heavy charm shown through actions rather than words.",
        hour: "Enjoys a prosperous old age based on wealth and virtue. A great elder who becomes a strong support for the family."
    },
    "己": {
        nature_year: "Small Flower Bed 🌱", nature_month: "Productive Farm 🚜", nature_day: "Fertile Garden 🌾", nature_hour: "Peaceful Countryside 🏡", keyword: "🌾 Practicality, 🎨 Versatility, 🧹 Self-management",
        year: "A clever and smart child. Versatile with quick learning and played a good mediator role.",
        month: "Shows the best practical ability with meticulous work. Shines especially in management and education fields.",
        day: "A practical person with detailed plans hidden in humility. Thorough self-management and faithfully achieves goals.",
        hour: "Finds reward in training juniors or educating children. Lives a quiet but practical life with fruitful activities in old age."
    },
    "庚": {
        nature_year: "Gemstone 💎", nature_month: "Iron in Smelter 🔨", nature_day: "Solid Rock 🪨", nature_hour: "Completed Sword ⚔️", keyword: "⚔️ Loyalty, 🔪 Decisiveness, 🛠️ Reform",
        year: "A loyal leader style full of justice. Stood out in sports or active fields.",
        month: "A charismatic leader with strong drive. Distinguishes public and private matters clearly and shines in moments requiring decision.",
        day: "Possesses rough but pure power. Strong convictions and cherishes relationships once formed to the end.",
        hour: "Ages honorably while keeping own principles. An old age that benefits those around with strict self-management."
    },
    "辛": {
        nature_year: "Pretty Bead 🔮", nature_month: "Surgical Scalpel 🔪", nature_day: "Shining Diamond 💎", nature_hour: "Treasure 👑", keyword: "💎 Delicacy, 📏 Sensitivity, ✨ Neatness",
        year: "A sensitive child with excellent aesthetic sense. Had strong pride and liked a sophisticated atmosphere.",
        month: "Succeeds in precise and delicate professions. Perfectionist tendency and has a keen eye for reading trends.",
        day: "Excellent ability to make oneself shine. Has cool reason but gives unsparingly to own people.",
        hour: "Enjoys an elegant later life without losing dignity and leisure. Maintains a young sense with sophisticated hobbies."
    },
    "壬": {
        nature_year: "Stream 💧", nature_month: "Water in Dam 🌊", nature_day: "Wide Sea 🌊", nature_hour: "Calm Lake 🏞️", keyword: "🌊 Wisdom, 🌍 Wanderlust, 🎭 Improvisation",
        year: "A child who enjoyed free exploration. Had a large scale, was bold, and had a precocious side.",
        month: "Plays an active part on a big stage with flexible thinking. Rich in ideas and excellent information gathering ability.",
        day: "Deep heart and wide tolerance. Not bound by any situation and overcomes difficulties wisely.",
        hour: "Possesses deep wisdom like a sage who has mastered the principles of the world. Spends a peaceful old age flowing like water."
    },
    "癸": {
        nature_year: "Morning Dew 💧", nature_month: "Rain wetting the earth 🌧️", nature_day: "Spring 🏞️", nature_hour: "Mysterious Fog 🌫️", keyword: "☔ Sensitivity, 💡 Idea, 🕊️ Purity",
        year: "A pure boy/girl with a tender heart and rich imagination. Popular due to good empathy ability.",
        month: "A strategist who wins with ideas. Shows soft charisma in a staff role rather than the front.",
        day: "A transparent and clear guardian angel-like soul. Looks fragile on the outside but has the tenacity to pierce rocks.",
        hour: "Spends a peaceful later life like a sanctuary. Enjoys meditation and service while embracing those around with a benevolent appearance."
    }
};


const stemReadings_ko = { "甲": "갑", "乙": "을", "丙": "병", "丁": "정", "戊": "무", "己": "기", "庚": "경", "辛": "신", "壬": "임", "癸": "계" };
const branchReadings_ko = { "子": "자", "丑": "축", "寅": "인", "卯": "묘", "辰": "진", "巳": "사", "午": "오", "未": "미", "申": "신", "酉": "유", "戌": "술", "亥": "해" };

const stemReadings_en = {
    "甲": "Yang Wood", "乙": "Yin Wood", "丙": "Yang Fire", "丁": "Yin Fire", "戊": "Yang Earth",
    "己": "Yin Earth", "庚": "Yang Metal", "辛": "Yin Metal", "壬": "Yang Water", "癸": "Yin Water"
};

const branchReadings_en = {
    "子": "Rat", "丑": "Ox", "寅": "Tiger", "卯": "Rabbit", "辰": "Dragon", "巳": "Snake",
    "午": "Horse", "未": "Sheep", "申": "Monkey", "酉": "Rooster", "戌": "Dog", "亥": "Pig"
};

/**
 * 💾 로컬 저장소 기능 (히스토리)
 */
function saveToHistory(data) {
    try {
        let history = JSON.parse(localStorage.getItem('saju_history') || '[]');

        // 중복 제거 (이름과 생년월일이 같으면 제거 후 최신으로 추가)
        history = history.filter(item => !(item.name === data.name && item.year === data.year && item.month === data.month && item.day === data.day));

        // 데이터 추가 (저장 시간 포함)
        data.id = Date.now();
        data.saveDate = new Date().toLocaleDateString();
        history.unshift(data);

        // 최대 5개 유지
        if (history.length > 5) history.pop();

        localStorage.setItem('saju_history', JSON.stringify(history));
    } catch (e) {
        console.error("히스토리 저장 실패:", e);
    }
}

function showHistoryList() {
    const history = JSON.parse(localStorage.getItem('saju_history') || '[]');
    const listEl = document.getElementById('history-list');
    const emptyEl = document.getElementById('empty-history');

    if (!listEl) return;
    listEl.innerHTML = '';

    if (history.length === 0) {
        emptyEl.style.display = 'block';
    } else {
        emptyEl.style.display = 'none';
        history.forEach(item => {
            const div = document.createElement('div');
            div.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:15px; margin-bottom:10px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; transition:0.2s;';
            div.onmouseover = () => div.style.background = 'rgba(255,255,255,0.1)';
            div.onmouseout = () => div.style.background = 'rgba(255,255,255,0.05)';

            const genderSymbol = item.gender === 'male' ? '♂️' : '♀️';

            div.innerHTML = `
                <div onclick="loadFromHistory(${item.id})" style="flex:1; text-align:left;">
                    <div style="font-weight:bold; font-size:1.1rem; color:#54a0ff;">${item.name} ${genderSymbol}</div>
                    <div style="font-size:0.85rem; opacity:0.7; margin-top:4px;">${item.year}.${item.month}.${item.day}</div>
                </div>
                <button onclick="deleteHistory(${item.id})" style="background:none; border:none; color:#ff6b6b; cursor:pointer; padding:5px; font-size:1.5rem; line-height:1;">&times;</button>
            `;
            listEl.appendChild(div);
        });
    }

    document.getElementById('history-modal').style.display = 'flex';
}

function closeHistoryModal() {
    document.getElementById('history-modal').style.display = 'none';
}

function loadFromHistory(id) {
    const history = JSON.parse(localStorage.getItem('saju_history') || '[]');
    const item = history.find(i => i.id === id);

    if (item) {
        document.getElementById('userName').value = item.name;
        const genderRadio = document.querySelector(`input[name="userGender"][value="${item.gender}"]`);
        if (genderRadio) genderRadio.checked = true;
        document.getElementById('birthYear').value = item.year;
        document.getElementById('birthMonth').value = item.month;

        // 일(Day) 선택박스 업데이트 후 값 설정
        if (typeof updateDays === 'function') updateDays();
        document.getElementById('birthDay').value = item.day;
        document.getElementById('birthTime').value = item.time;

        // ✅ 개인정보 동의 체크박스 자동 체크
        const privacyCheck = document.getElementById('privacy-agreement');
        if (privacyCheck) privacyCheck.checked = true;

        closeHistoryModal();

        // 자동으로 분석 버튼 클릭 효과 (event 객체 없이 호출 가능하도록 처리)
        const fakeEvent = { preventDefault: () => { } };
        analyzeSaju(fakeEvent);
    }
}

function deleteHistory(id) {
    let history = JSON.parse(localStorage.getItem('saju_history') || '[]');
    history = history.filter(item => item.id !== id);
    localStorage.setItem('saju_history', JSON.stringify(history));
    showHistoryList(); // 목록 새로고침
}
