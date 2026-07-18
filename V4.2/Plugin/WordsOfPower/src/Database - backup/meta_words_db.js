export const META_WORDS_DB = 
{
  "meta_boost": {
    "uid": "meta_boost",
    "name": "增强",
    "quality_limit": "普通",
    "mod_target": [
      "目标",
      "效果"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "增强": "此超魔咒字使一个效果或目标咒字启用其增强的效果。如果一个咒字有多种增强选择，施法者能选择用哪一个(但不能选择多于一个)。此此超魔每个咒字只能应用一次，但可以在同一个组合法术内的多个咒字分别应用"
    },
    "effect": null
  },
  "meta_enlarge": {
    "uid": "meta_enlarge",
    "name": "增远",
    "quality_limit": "普通",
    "mod_target": [
      "目标"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "增远": "此超魔咒字增加咒字法术的距离，取决于其目标咒字。近距成为中距(100尺+10尺/CL)，中距成为远距(400尺+40尺/CL)。此咒字对带有近距和中距之外的目标咒字没有效果。"
    },
    "effect": null
  },
  "meta_tenacious": {
    "uid": "meta_tenacious",
    "name": "顽强",
    "quality_limit": "稀有",
    "mod_target": [
      "法术"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 2000,
      "sp": 0
    },
    "effect_desc": {
      "顽强": "带有此超魔咒字的咒字法术之目标必须做两次豁免检定并取较差的结果"
    },
    "effect": null
  },
  "meta_extend": {
    "uid": "meta_extend",
    "name": "延长",
    "quality_limit": "普通",
    "mod_target": [
      "效果"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 2000,
      "sp": 0
    },
    "effect_desc": {
      "延长": "带有此超魔咒字的咒字法术持续时间加倍。对持续时间为“立即”的效果咒字没有效果。此超魔咒字的效果不会与“法术延时”专长叠加。"
    },
    "effect": null
  },

  "meta_delay": {
    "uid": "meta_delay",
    "name": "延迟",
    "quality_limit": "稀有",
    "mod_target": [
      "效果",
      "法术"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "effect_desc": {
      "延迟": "带有此超魔咒字的效果咒字释放时可设置最多延迟10轮生效。在这期间内你可以决定取消延迟令法术立即生效。但不得继续延迟。延迟结束后，法术在你最初指定的位置(延迟期间不得更改)生效。为一个效果咒字应用此超魔时，会阻塞该效果咒字之后所有效果的生效，但对之前没有影响。为法术应用则会暂停整个法术的生效"
    },
    "effect": null
  },
  "meta_inerting": {
    "uid": "meta_inerting",
    "name": "惰化",
    "quality_limit": "优良",
    "mod_target": [
      "效果"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 1000,
      "sp": 0
    },
    "effect_desc": {
      "惰化": "此超魔令立即生效的效果咒字的生效时间延长为n轮(不超过20)。对具有持续时间的咒字无效。这会令效果中伤害和治疗类效果的数值变为1/n，其余数值效果或者非数值类效果改为概率触发，触发条件 1d20>n"
    },
    "effect": null
  },
  "meta_selective": {
    "uid": "meta_selective",
    "name": "甄选",
    "quality_limit": "优良",
    "mod_target": [
      "法术"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "effect_desc": {
      "甄选": "在施法时选择数量最多为{施法主属性/4}个生物免受组合法术效果的影响，只对立即生效的范围形伤害或者治疗效果生效，对指向效果、持续效果、环境效果、反魔场、裂解术、解除魔法等无效"
    },
    "effect": null
  },
  "meta_solid": {
    "uid": "meta_solid",
    "name": "实型",
    "quality_limit": "稀有",
    "mod_target": [
      "法术"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "实型": "此超魔咒字改变咒字最终所用的豁免类型。如果需要精神检定，则改为体质检定。此改变不影响每个具体效果咒字的成功豁免检定是否无视、减轻其效果，或受到其他效果"
    },
    "effect": null
  },
  "meta_ethereal": {
    "uid": "meta_ethereal",
    "name": "虚型",
    "quality_limit": "稀有",
    "mod_target": [
      "法术"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "虚型": "此超魔咒字改变咒字最终所用的豁免类型。如果需要体质检定，则改为精神检定。此改变不影响每个具体效果咒字的成功豁免检定是否无视、减轻其效果，或受到其他效果。"
    },
    "effect": null
  },
  "meta_piercing": {
    "uid": "meta_piercing",
    "name": "穿透",
    "quality_limit": "传说",
    "mod_target": [
      "法术"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 10000,
      "sp": 0
    },
    "effect_desc": {
      "穿透": "此超魔令组合法术中所有效果可以穿透同级别以下技能带来的免疫和减免"
    },
    "effect": null
  },
  "meta_silent": {
    "uid": "meta_silent",
    "name": "安静",
    "quality_limit": "普通",
    "mod_target": [
      "效果"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 1000,
      "sp": 0
    },
    "effect_desc": {
      "安静": "带有此超魔咒字的咒字法术不需要语言成份。此超魔咒字可影响一个效果咒字。"
    },
    "effect": null
  },
  "meta_simple": {
    "uid": "meta_simple",
    "name": "简单",
    "quality_limit": "普通",
    "mod_target": [
      "效果"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 1000,
      "sp": 0
    },
    "effect_desc": {
      "简单": "带有此超魔咒字的咒字法术不需要材料成份。此超魔咒字可影响一个效果咒字。"
    },
    "effect": null
  },
  "meta_infinite": {
    "uid": "meta_infinite",
    "name": "无限",
    "quality_limit": "传说",
    "mod_target": [
      "法术"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 10000,
      "sp": 0
    },
    "effect_desc": {
      "无限": "令组合咒字的组成不受咒字数量以及MP上限限制。相应的，超过消耗上限的部分消耗等量的HP"
    },
    "effect": null
  }
}