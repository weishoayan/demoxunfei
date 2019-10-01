/**
 * Created by Junhua on 2019/1/9.
 */
var items = [
    {
        name:"房屋产权入户",
        link:"440802",
    },
    {
        name:"父母投靠成年子女",
        link:"440803",
    },
    {
        name:"未成年子女投靠父母",
        link:"440804",
    },
    {
        name:"大中专学生毕业回原籍",
        link:"440805",
    },
    {
        name:"退伍军人回原籍",
        link:"440806",
    },
    {
        name:"退伍军人异地安置（自有房产入户）",
        link:"440807",
    },
    {
        name:"退伍军人异地安置（投靠配偶入户）",
        link:"440808",
    },
    {
        name:"转业军人自主择业（自有房产入户）",
        link:"440809",
    },
    {
        name:"转业军人自主择业（投靠配偶入户）",
        link:"440810",
    },
    {
        name:"转业军人安置工作（自有房产入户）",
        link:"440811",
    },
    {
        name:"转业军人安置工作（投靠配偶入户）",
        link:"440812",
    },
    {
        name:"工作调动（本人迁入）",
        link:"13",
    },
    {
        name:"夫妻投靠",
        link:"440801",
    },
    {
        name:"工作调动（配偶、未成年子女随迁）",
        link:"14",
    },
    {
        name:"公民收养小孩入户",
        link:"15",
    },
    {
        name:"外国人、无国籍人、外籍华人和台湾同胞定居入户",
        link:"16",
    },
    {
        name:"华侨回国定居复户",
        link:"17",
    },
    {
        name:"香港、澳门居民定居入户",
        link:"18",
    },
    {
        name:"校车标牌核发",
        link:"66",
    },
    {
        name:"机动车驾驶证核发（初次申领）",
        link:"28",
    },
    {
        name:"机动车驾驶证增加准驾车型",
        link:"29",
    },
    {
        name:"机动车驾驶证期满换证",
        link:"30",
    },
    {
        name:"补领机动车驾驶证",
        link:"33",
    },
    {
        name:"注销机动车驾驶证",
        link:"34",
    },
    {
        name:"提交机动车驾驶人身体条件证明",
        link:"35",
    },
    {
        name:"机动车驾驶证审验",
        link:"36",
    },
    {
        name:"持军队、武装警察部队机动车驾驶证申领地方驾驶证",
        link:"37",
    },
    {
        name:"持境外机动车驾驶证申领地方驾驶证",
        link:"38",
    },
    {
        name:"异地机动车驾驶证转入换证",
        link:"39",
    },
    {
        name:"机动车驾驶证损毁换证",
        link:"40",
    },
    {
        name:"机动车驾驶人信息变化换证",
        link:"41",
    },
    {
        name:"机动车驾驶人达到规定年龄降级换证",
        link:"42",
    },
    {
        name:"机动车驾驶人自愿降低准驾车型换证",
        link:"43",
    },
    {
        name:"机动车驾驶证满分考试",
        link:"44",
    },
    {
        name:"校车驾驶资格申请",
        link:"45",
    },
    {
        name:"恢复驾驶证资格",
        link:"46",
    },
    {
        name:"临时机动车驾驶证申请",
        link:"47",
    },
    {
        name:"机动车注册登记",
        link:"48",
    },
    {
        name:"香港、澳门和台湾地区临时入境机动车登记",
        link:"49",
    },
    {
        name:"机动车转出本辖区变更登记",
        link:"50",
    },
    {
        name:"机动车所有人联系方式变更",
        link:"51",
    },
    {
        name:"机动车辖区内转移登记",
        link:"52",
    },
    {
        name:"机动车抵押（质押）登记",
        link:"53",
    },
    {
        name:"机动车解除抵押（质押）登记",
        link:"54",
    },
    {
        name:"机动车注销登记",
        link:"55",
    },
    {
        name:"机动车核发临时号牌",
        link:"56",
    },
    {
        name:"机动车补换领行驶证",
        link:"57",
    },
    {
        name:"机动车补换领号牌",
        link:"58",
        "DETAIL":"驾驶证类业务"
    },
    {
        name:"机动车补换领登记证书",
        link:"59",
        "DETAIL":"驾驶证类业务"
    },
    {
        name:"机动车登记事项更正",
        link:"60",
        "DETAIL":"驾驶证类业务"
    },
    {
        name:"机动车转入登记",
        link:"61",
        "DETAIL":"驾驶证类业务"
    },
    {
        name:"机动车转出登记",
        link:"62",
        "DETAIL":"驾驶证类业务"
    },
    {
        name:"机动车年检核发检验合格标志",
        link:"63",
        "DETAIL":"驾驶证类业务"
    },
    {
        name:"受托异地核发机动车检验合格标志",
        link:"64",
        "DETAIL":"驾驶证类业务"
    },
    {
        name:"委托异地核发机动车检验合格标志",
        link:"65",
        "DETAIL":"驾驶证类业务"
    },
    {
        name:"机动车变更登记",
        link:"67",
        "DETAIL":"驾驶证类业务"
    },
    {
        name:"婚生出生入户",
        link:"201003",
        "DETAIL":"出生登记"
    },
    {
        name:"申领临时居民身份证",
        link:"19",
        "DETAIL":"身份证业务"
    },
    {
        name:"申领居民身份证",
        link:"20",
        "DETAIL":"身份证业务"
    },
    {
        name:"换领居民身份证",
        link:"21",
        "DETAIL":"身份证业务"
    },
    {
        name:"补领居民身份证",
        link:"22",
        "DETAIL":"身份证业务"
    },
    {
        name:"未成年人姓名变更（未满14周岁）",
        link:"23",
        "DETAIL":"主项变更"
    },
    {
        name:"信息安全等级保护备案",
        link:"24",
        "DETAIL":"信息备案"
    },
    {
        name:"安全技术防范系统设计、施工、维修资格证核发（三级、四级）",
        link:"25",
        "DETAIL":"安全技术"
    },
    {
        name:"安全技术防范工程设计方案审批",
        link:"26",
        "DETAIL":"安全技术"
    },
    {
        name:"安全技术防范工程竣工验收",
        link:"27",
        "DETAIL":"安全技术"
    }
]