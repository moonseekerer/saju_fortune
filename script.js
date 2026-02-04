// 전역 상태
let currentPillars = null;
let pendingData = null;
let adShown = false;

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

const loveMap = {
    "甲": "곧게 뻗은 나무처럼 자존심이 강하고, 자신이 리드하는 연애를 선호합니다. <br><br>좋고 싫음이 분명하여 밀당을 하기보다는 직설적으로 감정을 표현하는 편입니다. 내 사람이다 싶으면 든든한 그늘이 되어 아낌없이 주는 나무처럼 헌신하지만, 자존심을 건드리면 관계가 급격히 냉각될 수 있습니다. <br>상대방에게 의지하기보다는 듬직하게 이끌어주기를 원하며, 존경할 수 있는 배울 점이 많은 person에게 끌립니다.",
    "乙": "유연한 넝쿨처럼 부드럽고 섬세한 연애를 합니다. 상대방의 감정을 잘 파악하고 맞춰주는 배려심이 뛰어나, 편안하고 친구 같은 연인 관계를 유지합니다. <br><br>하지만 겉으로는 유순해 보여도 소유욕과 질투심이 상당히 강한 편입니다.  사랑을 확인받고 싶어 하는 욕구가 크며, 집착으로 변질되지 않도록 주의해야 합니다.  어려움이 닥쳐도 쉽게 헤어지지 않고 끈기 있게 관계를 이어가는 힘이 있습니다.",
    "丙": "한낮의 태양처럼 숨김없이 화끈하고 정열적인 사랑을 합니다. <br><br>마음에 드는 이성이 나타나면 주저 없이 다가가며, 애정 표현도 적극적이고 화려합니다.  하지만 불같이 타올랐다가 금방 식어버리는 경향이 있어 '금사빠' 기질이 다분합니다.  뒤끝 없이 쿨한 연애를 지향하지만, 욱하는 성질 때문에 다툼이 잦을 수 있으니 감정 조절이 필요합니다.  밝고 명랑한 에너지로 연인을 즐겁게 해주는 분위기 메이커입니다.",
    "丁": "어둠을 밝히는 촛불처럼 은근하고 헌신적인 사랑을 합니다. <br><br>첫눈에 반하기보다는 시간을 두고 천천히 스며드는 사랑을 추구합니다.  상대방의 사소한 습관이나 취향까지 기억하는 세심함이 있으며, 한번 마음을 주면 웬만해서는 변치 않는 일편단심형입니다.  하지만 상처를 받으면 겉으로 내색하지 않고 속으로 끙끙 앓거나 오랫동안 꽁해 있을 수 있습니다.  따뜻한 모성애/부성애를 자극하는 매력이 있습니다.",
    "戊": "거대한 산처럼 묵묵히 자리를 지키며 믿음직스러운 연애를 합니다. <br><br>애교를 부리거나 달콤한 말을 하는 데는 서툴지만, 행동으로 보여주는 듬직한 사람입니다.  포용력이 넓어 연인의 투정을 잘 받아주며, 가벼운 만남보다는 결혼을 전제로 한 진지한 만남을 선호합니다.  하지만 변화를 싫어하고 고집이 세서, 한번 다투면 좀처럼 먼저 굽히지 않아 답답함을 줄 수도 있습니다.",
    "己": "비옥한 텃밭처럼 현실적이고 안정적인 연애를 추구합니다. <br><br>드라마 같은 로맨스보다는 서로에게 도움이 되고 실속 있는 관계를 중요하게 생각합니다.  상대방을 알뜰살뜰 잘 챙기고 배려하지만, 마음속으로는 이해득실을 계산하는 면도 있습니다.  의심이 많아 마음을 여는 데 시간이 걸리지만, 한번 깊어지면 가족처럼 편안하고 끈끈한 사이가 됩니다.",
    "庚": "단단한 바위처럼 의리와 신의를 중요시하는 사랑을 합니다. <br><br>맺고 끊음이 확실하여 어장관리를 하거나 애매한 태도를 보이는 것을 극도로 싫어합니다.  카리스마 있게 상대를 리드하며, 내 사람에게는 확실하게 책임을 지는 상남자/걸크러쉬 스타일입니다.  다만 자기주장이 너무 강하고 무뚝뚝하여 상대방이 상처받을 수 있으니, 부드러운 대화법을 익히는 것이 좋습니다.",
    "辛": "반짝이는 보석처럼 섬세하고 까다로운 취향을 가졌습니다. <br><br>외모나 스타일, 매너 등 자신만의 확고한 기준이 있어 눈이 높은 편입니다.  깔끔하고 세련된 데이트를 선호하며, 분위기에 약한 로맨티스트입니다.  예민한 감수성 때문에 사소한 말 한마디에도 쉽게 상처받을 수 있으며, 냉정하게 돌아설 때는 그 누구보다 차갑습니다.  자신을 빛나게 해주는 사람에게 끌립니다.",
    "壬": "넓은 바다처럼 자유분방하고 스케일이 큰 연애를 합니다. <br><br>구속받는 것을 죽기보다 싫어하며, 서로의 사생활을 존중해 주는 쿨한 관계를 원합니다.  육체적인 매력보다는 정신적인 교감이나 대화가 통하는 것을 더 중요하게 생각합니다.  유머 감각이 있고 임기응변이 뛰어나 이성에게 인기가 많지만, 속마음을 다 보여주지 않아 '나쁜 남자/여자' 같다는 오해를 사기도 합니다.",
    "癸": "봄비처럼 촉촉하게 스며드는 다정다감한 연애를 합니다. <br><br>애교가 많고 상냥하며, 상대방의 기분을 귀신같이 파악하여 맞춰주는 센스가 있습니다.  하지만 마음이 여려 상처를 잘 받고, 감정 기복이 심해 연인을 당황하게 만들기도 합니다.  상대방에게 의존하려는 경향이 있으며, 사랑을 확인함으로써 불안감을 해소하려 합니다.  보호 본능을 자극하는 묘한 매력의 소유자입니다."
};

const natureMap = {
    "甲": "당신은 곧게 뻗은 대림목(큰 나무)과 같습니다. 뿌리가 깊고 기둥이 튼튼하여 어지간한 비바람에도 흔들리지 않는 강인한 멘탈을 소유하고 있습니다. 겉으로는 무뚝뚝해 보일 수 있지만, 속에는 그 누구보다 강한 '성장 욕구'와 '자존심'이 꿈틀대고 있습니다. \n\n남의 밑에서 지시받는 것을 좋아하지 않으며, 본인이 주도하여 결정을 내릴 때 가장 큰 능력을 발휘합니다. 리더십이 뛰어나고 책임감이 강해서, 한번 맡은 일은 끝까지 해내는 뚝심이 있습니다. 다만, 때로는 너무 융통성이 없어 '대나무' 같다는 평을 들을 수도 있으니 적당히 휘어지는 지혜도 필요합니다.",
    "乙": "당신은 끈질긴 생명력을 지닌 넝쿨 식물입니다. 화려한 장미 덩굴일 수도 있고, 척박한 땅에서도 살아남는 잡초일 수도 있습니다. 겉모습은 부드럽고 유연해 보이지만, 내면은 그 어떤 바위도 뚫고 나오는 무서운 집념을 가지고 있습니다. \n\n환경 적응력이 타의 추종을 불허합니다. 어떤 어려움이 닥쳐도 정면으로 부딪혀 깨지기보다는, 유연하게 휘고 돌아서 결국 살아남는 지혜를 가졌습니다. 바람이 불면 눕고, 바람이 멈추면 다시 일어나는 당신은 진정한 생존의 고수입니다. 사람들과 어울리는 것을 좋아하고 현실적인 이익을 잘 챙기는 실속파이기도 합니다.",
    "丙": "당신은 하늘에 떠 있는 태양입니다. 숨기려 해도 숨겨지지 않는 화려한 존재감이 당신의 가장 큰 무기입니다. 매사에 열정적이고 적극적이며, 사람들에게 베푸는 것을 좋아하여 주변에 항상 사람들이 모여듭니다. \n\n거짓말을 잘 못하고 감정이 얼굴에 그대로 드러나는 솔직 담백한 성격입니다. 예의와 공중도덕을 중시하며, 불의를 보면 참지 못하는 정의감도 있습니다. 하지만 욱하는 성질이 있어 순간적으로 화를 참지 못해 일을 그르칠 수 있으니, 감정 조절만 잘한다면 만인의 존경을 받는 태양이 될 것입니다.",
    "丁": "당신은 어둠을 밝히는 은은한 촛불이나 밤하늘의 달빛과 같습니다. 겉으로는 조용하고 차분해 보이지만, 그 속에는 용광로처러 뜨거운 열정과 에너지를 품고 있습니다. 한 가지 분야에 꽂히면 무서운 집중력을 발휘하여 전문가의 경지에 오르는 '장인 정신'의 소유자입니다. \n\n섬세하고 감수성이 풍부하여 남의 아픔에 잘 공감하고 배려심이 깊습니다. 사람을 챙기는 것을 좋아하여 '엄마' 같은 따뜻함을 줍니다. 하지만 한번 토라지거나 상처를 받으면 꽁하고 오랫동안 마음에 담아두는 경향이 있으며, 친한 사람에게 집착하는 모습을 보이기도 합니다.",
    "戊": "당신은 만물을 품어주는 거대한 산이나 드넓은 광야입니다. 언제나 그 자리에 묵묵히 서 있는 산처럼, 믿음직스럽고 신뢰감을 주는 사람입니다. 말과 행동이 가볍지 않고 진중하여, 주변 사람들이 당신에게 비밀을 털어놓거나 의지하고 싶어 합니다. \n\n포용력이 넓어 다양한 사람들을 받아들이고 중재하는 역할을 잘합니다. 하지만 산이 쉽게 움직이지 않듯, 당신 또한 변화를 싫어하고 고집이 냅니다. 한번 정한 생각은 좀처럼 바꾸려 하지 않아 '벽창호'라는 소리를 들을 수도 있습니다. 때로는 과감하게 움직이는 융통성을 발휘한다면 더 큰 성취를 이룰 수 있습니다.",
    "己": "당신은 농작물을 길러내는 비옥한 논밭과 같습니다. 겉모습은 소박하고 평범해 보일지 몰라도, 그 안에는 수많은 생명을 키워내는 기막힌 다재다능함이 숨어 있습니다. 실속을 중요하게 생각하여 무모한 도전보다는 확실하고 안정적인 길을 선택하는 현명함이 있습니다. \n\n이해타산이 빠르고 눈치가 좋아 사회생활을 아주 잘합니다. 남에게 모진 소리를 잘 못하고 웬만하면 맞춰주려 하지만, 자기 것은 확실하게 챙기는 스타일입니다. 남을 가르치고 키우는 일에 보람을 느끼며, 꼼꼼하고 세심한 일처리가 돋보입니다. 다만 의심이 많아 기회를 놓칠 수 있으니 주의하세요.",
    "庚": "당신은 제련되지 않은 거친 원석이나 단단한 무쇠입니다. 투박하지만 강력한 힘과 카리스마를 가지고 있습니다. 옳고 그름이 명확하여, 아닌 것은 아니라고 딱 잘라 말하는 결단력이 있습니다. 의리를 목숨처럼 중요하게 생각하여, 내 사람이라고 생각되면 끝까지 책임지는 상남자/여장부 스타일입니다. \n\n개혁적인 성향이 강해 기존의 낡은 관습을 타파하고 새로운 질서를 만드는 것을 좋아합니다. 하지만 너무 강하면 부러지기 쉽습니다. 융통성이 부족하고 자신의 주장만 고집하다가 주변과 마찰을 빚을 수 있습니다. 자신을 갈고닦아 세련된 모습으로 거듭난다면 세상을 호령할 큰 그릇입니다.",
    "辛": "당신은 이미 세공이 끝난 반짝이는 보석이나 날카로운 칼날입니다. 섬세하고 예민하며, 깔끔하고 완벽한 것을 추구합니다. 남들에게 보여지는 이미지를 중요하게 생각하여 겉모습을 꾸미는 데 관심이 많고 감각도 뛰어납니다. \n\n자존심이 하늘을 찌르고, 본인이 최고라고 생각하는 '공주/왕자' 기질이 있습니다. 남의 간섭이나 잔소리를 누구보다 싫어합니다. 예리한 관찰력으로 남의 허를 찌르는 말을 잘하며, 한번 상처를 받으면 차갑게 돌아서는 냉정함도 있습니다. 그만큼 자신을 빛나게 하는 능력이 탁월하여 어디서든 주목받는 존재입니다.",
    "壬": "당신은 끝을 알 수 없는 깊은 바다나 큰 호수입니다. 마음이 바다처럼 넓어 모든 것을 받아들이는 포용력이 있고, 지혜와 총명함을 타고났습니다. 자유롭게 흐르는 물처럼 어디에도 얽매이지 않는 자유로운 영혼의 소유자이며, 임기응변에 능하고 상황 대처 능력이 뛰어납니다. \n\n스케일이 크고 야망이 있으며, 해외와 인연이 깊습니다. 사교성이 좋아 두루두루 잘 어울리지만, 정작 자신의 진짜 속마음은 깊은 물속에 감추고 보여주지 않습니다. 그래서 '속을 알 수 없는 사람'이라는 평을 듣기도 합니다. 한곳에 머물기보다는 끊임없이 새로운 세상으로 나아가려는 역마의 기운이 강합니다.",
    "癸": "당신은 대지를 적시는 봄비나 졸졸 흐르는 시냇물입니다. 맑고 순수한 영혼을 가졌으며, 타인의 감정에 민감하게 반응하고 공감해주는 따뜻한 마음씨를 지녔습니다. 아이디어와 상상력이 풍부하고 두뇌 회전이 빨라, 남들이 생각지 못한 기발한 발상으로 주변을 놀라게 합니다. \n\n작은 물방울이 바위를 뚫듯, 겉으로는 여려 보이지만 끈기와 인내심이 대단합니다. 하지만 감정 기복이 심해 우울감에 빠지기 쉽고, 남의 눈치를 너무 많이 보는 경향이 있습니다. 조용히 자신의 자리를 지키며 주변을 부드럽게 변화시키는 '외유내강'의 전형입니다."
};

const fortune2026Map = {
    "甲": "2026년은 당신의 재능이 꽃을 피우는 해입니다. 태양(丙)이 나무(甲)를 비추니 그동안 준비했던 것들이 세상 밖으로 드러나 인정을 받게 됩니다. 활동력이 왕성해지고 표현하고 싶은 욕구가 강해집니다. 다만 너무 에너지를 쏟아내다 보면 건강을 해칠 수 있으니 휴식도 필요합니다.\n\n<br><strong>💡 행운의 팁:</strong> 자신의 아이디어를 적극적으로 알리세요. 유튜브나 SNS 활동도 좋습니다.",
    "乙": "인생의 하이라이트와 같은 화려한 한 해입니다. 당신의 매력이 널리 알려져 인기가 급상승하고, 숨겨진 재능을 마음껏 뽐낼 수 있는 무대가 마련됩니다. 예술이나 창작 활동을 한다면 대박이 날 수 있습니다. 다만, 말과 행동이 과감해져서 구설수에 오를 수도 있으니 겸손함을 잃지 마세요.\n\n<br><strong>💡 행운의 팁:</strong> 화려한 옷이나 악세서리가 행운을 부릅니다.",
    "丙": "불이 불을 만난 형국으로, 경쟁심과 승부욕이 불타오르는 해입니다. 친구나 동료들과 함께 협력하여 큰일을 도모할 수도 있지만, 반대로 치열한 경쟁 상황에 놓일 수도 있습니다. 자신감이 넘치고 추진력이 강해지지만, 독단적인 결정은 피해야 합니다. 재물보다는 명예나 사람을 얻는 데 집중하세요.\n\n<br><strong>💡 행운의 팁:</strong> 독단적인 행동보다는 팀워크를 중시하세요.",
    "丁": "강력한 조력자를 만나거나 경쟁을 통해 성장하는 시기입니다. 당신의 은은한 불빛이 거대한 태양을 만나 빛을 잃는 듯하지만, 오히려 큰 불에 합세하여 세력을 키우는 기회가 될 수 있습니다. 혼자 하기 벅찬 일들은 주변의 도움을 받으면 쉽게 해결됩니다. 형제나 친구 관계로 인한 금전 지출에 주의하세요.\n\n<br><strong>💡 행운의 팁:</strong> 주변 사람들에게 베푸는 것이 나중에 큰 복으로 돌아옵니다.",
    "戊": "문서운과 학업운이 매우 좋은 해입니다. 당신의 넓은 땅에 뜨거운 태양 빛이 쏟아지니, 만물이 무럭무럭 자라나는 격입니다. 부동산 계약, 자격증 취득, 승진 시험 등에 유리합니다. 윗사람이나 귀인의 도움을 받아 안정적인 기반을 다질 수 있습니다. 다만 생각이 너무 많아져 실천이 늦어질 수 있습니다.\n\n<br><strong>💡 행운의 팁:</strong> 중요한 계약이나 문서는 꼼꼼히 검토하세요.",
    "己": "노력에 대한 보상을 확실하게 받는 정직한 해입니다. 흙이 불에 구워져 단단한 그릇이 되듯, 당신의 실력과 지위가 한층 견고해집니다. 학문적인 성취나 전문 분야에서의 인정이 따릅니다. 다만 너무 원칙만 고집하다가 융통성 없다는 소리를 들을 수 있으니 유연하게 대처하세요.\n\n<br><strong>💡 행운의 팁:</strong> 새로운 배움이나 자격증 취득에 도전해보세요.",
    "庚": "직장운과 명예운이 상승하는 시기입니다. 강력한 불(관성)이 당신(쇠)을 단련시키니, 힘든 과정이 있더라도 결과적으로는 멋진 명검으로 거듭나게 됩니다. 승진이나 취업, 이직 등 커리어에 큰 변화가 생길 수 있습니다. 스트레스 관리가 필수이며, 과로를 피해야 합니다.\n\n<br><strong>💡 행운의 팁:</strong> 규칙적인 운동으로 체력을 관리하세요.",
    "辛": "새로운 사랑이 찾아오거나 직장에서 인정을 받는 해입니다. 당신(보석)이 조명을 받아 반짝이는 형국입니다. 다만 불이 너무 강하면 보석이 녹을 수도 있으니, 무리한 욕심이나 감정적인 대응은 금물입니다. 관재구설에 휘말리지 않도록 언행을 조심하고, 건강 관리에 신경 써야 합니다.\n\n<br><strong>💡 행운의 팁:</strong> 붉은색 계열의 소품은 피하는 것이 좋습니다.",
    "壬": "역동적인 재물운이 들어오는 시기입니다. 물과 불이 부딪혀 수증기를 일으키듯, 큰돈이 들어오고 나가는 등 변화가 무쌍합니다. 사업을 확장하거나 투자를 하기에 좋은 기회이지만, 리스크 관리도 철저히 해야 합니다. 예상치 못한 횡재수가 있을 수 있으나, 과욕은 화를 부릅니다.\n\n<br><strong>💡 행운의 팁:</strong> 철저한 분석 없는 투자는 금물입니다.",
    "癸": "안정적인 수입과 결과물이 따르는 해입니다. 뜨거운 열기를 시원한 비가 식혀주듯, 당신의 존재가 조직이나 모임에서 환영받게 됩니다. 재물운이 안정적이며, 남자가 여자에게, 여자가 남자에게 헌신하는 운이기도 합니다. 꼼꼼하게 실속을 챙기면 알토란 같은 재산을 모을 수 있습니다.\n\n<br><strong>💡 행운의 팁:</strong> 저축이나 적금 등 안정적인 자산 관리가 좋습니다."
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
    const sRead = stemReadings[stem] || "?";
    const bRead = branchReadings[branch] || "?";
    const sColor = getColorClass(stem);
    const bColor = getColorClass(branch);

    return `<span class="${sColor}">${stem}<span style="font-size:0.4em; opacity:0.8; margin-left:1px;">(${sRead})</span></span>` +
        `<span class="${bColor}">${branch}<span style="font-size:0.4em; opacity:0.8; margin-left:1px;">(${bRead})</span></span>`;
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
    if (timeIdx != 99) {
        hourBranch = branches[timeIdx];
        const dStemIdx = stems.indexOf(dayStem);
        const hSBase = (dStemIdx % 5) * 2;
        const hSIdx = (hSBase + parseInt(timeIdx)) % 10;
        hourStem = stems[hSIdx];
    } else {
        hourStem = "모"; hourBranch = "름";
    }

    return {
        year: { s: yearStem, b: yearBranch },
        month: { s: monthStem, b: monthBranch },
        day: { s: dayStem, b: dayBranch },
        hour: { s: hourStem, b: hourBranch }
    };
}

function analyzeSaju(e) {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const time = document.getElementById('birthTime').value;

    document.getElementById('loading').style.display = 'flex';

    // Google Apps Script 연동
    fetch("https://script.google.com/macros/s/AKfycbxQIJnI8fGa5mnrdCWWdWjw_3Vi2endY0HhXgajiY-JWypycpOpxQJBi53fG_1SDRny/exec", {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ name, year, month, day, time })
    }).catch(err => console.log("Log fail", err));

    const pillars = calculatePillars(year, month, day, time);
    currentPillars = pillars;

    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        if (!adShown) {
            pendingData = { name, year, month, day, pillars };
            showAdWithCountdown();
        } else {
            showSajuResult({ name, year, month, day, pillars });
        }
    }, 1200);
}

function showAdWithCountdown() {
    const popup = document.getElementById('ad-popup');
    const btn = document.getElementById('ad-close-btn');
    popup.style.display = 'flex';
    btn.disabled = true;
    let count = 3;
    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            btn.innerText = `광고 확인 중 (${count}...)`;
        } else {
            clearInterval(timer);
            btn.disabled = false;
            btn.innerText = "광고 닫고 결과 확인하기";
        }
    }, 1000);
}

function closeAdPopup() {
    document.getElementById('ad-popup').style.display = 'none';
    adShown = true;
    if (pendingData) {
        showSajuResult(pendingData);
        pendingData = null;
    }
}

function showSajuResult(data) {
    const { name, year, month, day, pillars } = data;
    document.getElementById('input-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    window.scrollTo(0, 0);

    document.getElementById('result-name-title').innerText = `${name}님 사주 리포트`;
    document.getElementById('result-desc').innerText = `${year}.${month}.${day}생 | ${pillars.day.s}${pillars.day.b}일주`;

    // 기둥 업데이트 (Hanja)
    document.getElementById('year-pillar').innerHTML = getColoredHtml(pillars.year.s, pillars.year.b);
    document.getElementById('month-pillar').innerHTML = getColoredHtml(pillars.month.s, pillars.month.b);
    document.getElementById('day-pillar').innerHTML = getColoredHtml(pillars.day.s, pillars.day.b);
    document.getElementById('hour-pillar').innerHTML = getColoredHtml(pillars.hour.s, pillars.hour.b);

    // 기본 텍스트 업데이트
    const dStem = pillars.day.s;
    document.getElementById('nature-text').innerHTML = `<span class="nature-badge">${dStem}(${stemReadings[dStem]})</span><br><br>${natureMap[dStem] || "신비로운 매력이 있습니다."}`;
    document.getElementById('fortune-text').innerHTML = fortune2026Map[dStem] || "운세를 가져오는 중...";
    document.getElementById('love-text').innerHTML = loveMap[dStem] || "연애운 정보가 없습니다.";
    document.getElementById('wealth-text').innerHTML = "재물운 그릇이 큽니다. 노력한 만큼 결실을 맺는 타입입니다.";

    showTabDetail('day');
    switchSubTab('general');
}

function showTabDetail(type) {
    if (!currentPillars) return;
    const data = currentPillars[type];
    document.querySelectorAll('.mini-col').forEach(c => c.classList.remove('active'));
    document.getElementById(`col-${type}`).classList.add('active');

    const titleEl = document.getElementById('detail-title');
    const bodyEl = document.getElementById('detail-body');
    const interp = pillarInterpretations[data.s] || {};

    let titleText = "";
    let bodyHtml = "";

    if (type === 'hour' && data.s === '모') {
        titleText = "시주: 정보 없음";
        bodyHtml = "<p>시간을 모르면 말년운과 자식운 분석이 어렵습니다.</p>";
    } else {
        const labels = { year: "년주(뿌리)", month: "월주(사회)", day: "일주(나)", hour: "시주(미래)" };
        titleText = `${labels[type]}: ${data.s}${data.b}`;
        const detail = interp[type] || "기운이 조화롭습니다.";
        bodyHtml = `<div style="background:rgba(255,215,0,0.05); padding:12px; border-radius:10px; margin-bottom:12px; font-weight:bold; color:#ffd700;">${interp.keyword || ""}</div><p>${detail}</p>`;
    }

    titleEl.innerText = titleText;
    bodyEl.innerHTML = bodyHtml;
    document.getElementById('tab-detail-display').style.display = 'block';
}

function switchSubTab(tab) {
    document.querySelectorAll('.analysis-view').forEach(v => v.style.display = 'none');
    document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`view-${tab}`).style.display = 'block';
    document.getElementById(`btn-${tab}`).classList.add('active');
}

function goBack() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('input-screen').style.display = 'flex';
}
