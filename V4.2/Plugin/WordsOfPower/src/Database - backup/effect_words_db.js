export const EFFECT_WORDS_DB = 
{
  "effect_force_shield": {
    "uid": "effect_force_shield",
    "name": "力场结界",
    "quality": "史诗",
    "type": "被动",
    "tags": ["防护系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["个人", "选择"],
    "is_harmless": true,
    "duration": {
      "raw": "10分钟/等级"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "力场防护": "目标AC获得+6护甲加值，以及每4个CL +1，对虚体有效。如果目标从其他来源获得了更高的护甲加值，则改为将该护甲加值提高2点并使之能防御来自虚体的攻击。"
    },
    "effect": {
      "力场防护": null
    }
  },
  "effect_permanent_paralysis": {
    "uid": "effect_permanent_paralysis",
    "name": "永久麻痹",
    "quality": "唯一",
    "type": "被动",
    "tags": ["惑控系", "胁迫", "影响心灵", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": "意志",
      "on_save": "通过则无效"
    },
    "target_limit": ["选择"],
    "is_harmless": false,
    "duration": {
      "raw": "无限"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "永久麻痹": "目标被麻痹，不能移动。他能感知周围事物以及正常呼吸，但是不能进行任何行动。可影响任何种类的生物，且持续时间为永久。被影响的目标在第一次豁免失败的之后第二轮结束时获得一个额外的意志豁免。这个豁免检定只用来终止此咒字的效果，而不是同一咒字法术的其他效果咒字。如果第二次豁免也失败，那么这个咒字的效果只能被高等解除魔法，奇迹术或祈愿术解除"
    },
    "effect": {
      "永久麻痹": null
    }
  },
  "effect_energy_resistance ": {
    "uid": "effect_energy_resistance",
    "name": "能量抗力",
    "quality": "稀有", 
    "type": "被动",
    "tags": ["防护系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 800,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["个人", "选择"],
    "is_harmless": true,
    "duration": {
      "raw": "10分钟/等级"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "能量抗性": "目标在对抗一种元素类型时获得20%抗性。但仍会受到伴随能量伤害的特殊效果"
    },
    "effect": {
      "元素免疫": null
    }
  },
  "effect_elemental_immunity": {
    "uid": "effect_elemental_immunity",
    "name": "元素免疫",
    "quality": "史诗",
    "type": "被动",
    "tags": ["防护系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 5000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["个人", "选择"],
    "is_harmless": true,
    "duration": {
      "raw": "1轮/等级"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "元素免疫": "目标免疫指定一种类型的能量伤害。但仍会受到伴随能量伤害的特殊效果"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "抗性提高到40%"
      }
    },
    "effect": {
      "元素免疫": null
    }
  },
  "effect_perfect_form": {
    "uid": "effect_perfect_form",
    "name": "完美形态",
    "quality": "神话",
    "type": "被动",
    "tags": ["变化系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 0,
      "swift": 0,
      "free": 0,
      "multi_turn": "施法时间10分钟",
      "raw": ""
    },
    "extra_cost": {
      "hp": 0,
      "mp": 25000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["个人", "选择"],
    "is_harmless": true,
    "duration": {
      "raw": "永久"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "完美形态": "目标的全部属性检定获得+6增强加值",
      "补充描述": "释法时间: 10min"
    },
    "effect": {
      "完美形态": null
    }
  },
  "effect_cold_snap": {
    "uid": "effect_cold_snap",
    "name": "骤霜",
    "quality": "稀有",
    "type": "主动",
    "tags": ["塑能系", "智力/精神"],
    "damage": "每CL100",
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "攻击"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 500,
      "sp": 0
    },
    "save_type": {
      "type": "无或体质",
      "on_save": "免除效果"
    },
    "target_limit": ["个人", "选择"],
    "is_harmless": false,
    "duration": {
      "raw": "无"
    },
    "effect_desc": {
      "寒冷": "造成寒冷伤害。豁免失败的目标恍惚1轮(只能做出移动或攻击)"
    },
    "effect": {
      "寒冷": null
    }
  },
  "effect_force_ball": {
    "uid": "effect_force_ball",
    "name": "力场球",
    "quality": "稀有",
    "type": "主动",
    "tags": ["塑能系", "智力/精神"],
    "damage": "每CL50",
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "攻击"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 500,
      "sp": 0
    },
    "save_type": {
      "type": "无或力量",
      "on_save": "免除效果"
    },
    "target_limit": ["个人", "选择"],
    "is_harmless": false,
    "duration": {
      "raw": "无"
    },
    "effect_desc": {
      "力场冲击": "每4CL制造一颗力场球体攻击目标，造成力场伤害。每次被击中的目标都需要进行力量豁免，失败则被击退并倒地。如果被障碍物阻挡，受到和冲击力/重量/障碍材质均正相关的物理伤害"
    },
    "effect": {
      "力场冲击": null
    }
  },
  "effect_drain_life": {
    "uid": "effect_drain_life",
    "name": "汲取生命",
    "quality": "神话",
    "type": "主动",
    "tags": ["死灵系", "智力/精神"],
    "damage": "5000",
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "攻击"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["个人", "选择"],
    "is_harmless": false,
    "duration": {
      "raw": "立即"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "回复造成伤害一半的hp,mp.sp"
      }
    },
    "effect_desc": {
      "汲取生命": "回复造成的伤害一半的hp"
    },
    "effect": {
      "汲取生命": null
    }
  },
  "effect_cataclysm": {
    "uid": "effect_cataclysm",
    "name": "灾变",
    "quality": "唯一",
    "type": "主动",
    "tags": ["塑能系", "智力/精神"],
    "damage": "6000",
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "攻击"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": "敏捷",
      "on_save": "伤害减半"
    },
    "target_limit": ["爆发"],
    "is_harmless": false,
    "duration": {
      "raw": "1轮/等级"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "灾变": "使范围内乌云密布，从天空降下暴雨及冰雹，遮挡视线并阻止任何远程攻击。近战攻击受到20%失手率。在范围内的生物第一轮开始时受到由冰雹的物理寒冷混合伤害。此外，施法者每轮可降下一道闪电造成电击伤害，可使闪电击中任意数量的目标，并将伤害占比任意分配。目标可做一个敏捷检定来使伤害减半。豁免失败的目标同时会因冲击的力量而倒地。在持续时间内，此效果咒字范围内的地形视为困难地形，但对施法者除外。",
    },
    "effect": {
      "灾变": null
    }
  },
  "effect_touch_of_life": {
    "uid": "effect_touch_of_life",
    "name": "生命之触",
    "quality": "神话",
    "type": "主动",
    "tags": ["咒法系", "医疗", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["选择"],
    "is_harmless": true,
    "duration": {
      "raw": "立即"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "生命之触": "可以使死物复活，目标的灵魂能够看到施法者的样貌，并且选择不复生，致使咒字法术失败。用于死亡至多每CL1天的生物身上。被复活的生物会恢复至原本HP的一半，并且他的身体无须完整(只需要这名生物的一点破片即可)。在生物死前缺失的部分均不会通过这个效果咒字恢复。目标生物通过这个效果咒字受到1个负向等级，并且这个负向等级会在24小时后消失(能够在更早的时候被其他方式移除)。生物保留生前的记忆、技能、mp、sp"
    },
    "effect": {
      "生命之触": null
    }
  },
  "effect_dimension_door": {
    "uid": "effect_dimension_door",
    "name": "次元门",
    "quality": "神话",
    "type": "主动",
    "tags": ["咒法系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["爆发"],
    "is_harmless": false,
    "duration": {
      "raw": "1轮/等级"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "次元门": "创造出一道门，这道门联通了施法者所在的位面与其他位面(或本位面)。当这座门被开启后，两地的生物，法术，效果以及物体均可以通过这道门自由穿行，这道门呈现出由法术正中扩散开的空门的形态。施法者无法预测门对面的情况，也无法直接控制门的关闭(除非使用解除魔法类效果)"
    },
    "effect": {
      "次元门": null
    }
  },
  "effect_haste_time": {
    "uid": "effect_haste_time",
    "name": "加速时间",
    "quality": "史诗",
    "type": "被动",
    "tags": ["变化系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["选择"],
    "is_harmless": true,
    "duration": {
      "raw": "1轮/等级"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "如果目标进行全力攻击，他能够使用最高的攻击加值进行一次额外攻击来取代那次额外的移动动作"
      }
    },
    "effect_desc": {
      "时间加速": "带有该效果咒字的咒字法术的目标能够每轮额外进行一个[动作]。这个动作能够在其他动作之前、之后或者之间，但是不能在整轮动作之中进行。"
    },
    "effect": {
      "时间加速": null
    }
  },
  "effect_slow_time": {
    "uid": "effect_slow_time",
    "name": "减速时间",
    "quality": "史诗",
    "type": "被动",
    "tags": ["变化系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "save_type": {
      "type": "意志",
      "on_save": "通过则无效"
    },
    "target_limit": ["选择"],
    "is_harmless": false,
    "duration": {
      "raw": "1轮/等级"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "目标无法进行额外的豁免以结束该效果。如果目标在第一次豁免失败，那么他会在咒字法术的整个持续时间内处于恍惚状态"
      }
    },
    "effect_desc": {
      "时间减速": "目标在该效果咒字的持续时间之内处于恍惚状态，只能做出一个[攻击]或[动作]。每轮结束时可进行一次新的豁免以结束这个效果"
    },
    "effect": {
      "时间减速": null
    }
  },
  "effect_borrow_future": {
    "uid": "effect_borrow_future",
    "name": "预支未来",
    "quality": "传说",
    "type": "被动",
    "tags": ["变化系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 8000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["选择"],
    "is_harmless": true,
    "duration": {
      "raw": "立即"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "目标在他的下一回合处于恍惚，只能做出一个[攻击]或[动作]而不是完全无法行动"
      }
    },
    "effect_desc": {
      "预支未来": "目标在咒字施放后，立刻获得一个攻击和动作(至多每轮1次)。目标跳过他的下一回合，但任何在他的回合产生的效果，或者将要在他的回合结束的法术效果均如常生效。目标在他的下一回合中并非无助，但是无法进行任何行动。如果目标次本轮还未行动，则预支本轮的行动，如果已经行动，则预支下一轮"
    },
    "effect": {
      "预支未来": null
    }
  },
  "effect_manipulate_time": {
    "uid": "effect_manipulate_time",
    "name": "操纵时间",
    "quality": "唯一",
    "type": "被动",
    "tags": ["变化系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 25000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["选择"],
    "is_harmless": true,
    "duration": {
      "raw": "立即"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "操纵时间": "环绕着带有该效果咒字的目标的时间停了下来，这使得目标能够在时间重新流逝之前进行4个[攻击]或[动作]。额外行动可以用来继续释放操纵时间。所有其他生物以及物体均会在这些额外动作中免疫目标的行动。目标通常在这段时间内如常对他自身施法以及使用物品或逃跑。目标可以选择提前结束法术效果，此时可以选择影响其他目标的效果作为最后一个动作"
    },
    "effect": {
      "操纵时间": null
    }
  },
  "effect_negation_dispelling": {
    "uid": "effect_negation_dispelling",
    "name": "否决",
    "quality": "唯一",
    "type": "被动",
    "tags": ["防护系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "攻击"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 15000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "无"
    },
    "target_limit": ["选择"],
    "is_harmless": true,
    "duration": {
      "raw": "立即"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "操纵时间": "环绕着带有该效果咒字的目标的时间停了下来，这使得目标能够在时间重新流逝之前进行4个[攻击]或[动作]。额外行动可以用来继续释放操纵时间。所有其他生物以及物体均会在这些额外动作中免疫目标的行动。目标通常在这段时间内如常对他自身施法以及使用物品或逃跑。目标可以选择提前结束法术效果，此时可以选择影响其他目标的效果作为最后一个动作"
    },
    "effect": {
      "操纵时间": null
    }
  },
  "effect_veil_of_meteors": {
    "uid": "effect_veil_of_meteors",
    "name": "流星之幕",
    "quality": "稀有",
    "type": "主动",
    "tags": ["塑能系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "动作"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 800,
      "sp": 0
    },
    "save_type": {
      "type": "无",
      "on_save": ""
    },
    "damage": "200每颗",
    "target_limit": ["爆发"],
    "is_harmless": false,
    "duration": {
      "raw": "1分钟/等级或直到消耗"
    },
    "overall_desc" : "",
    "effect_desc": {
      "流星之幕": "创造10颗微型流星，漂浮并在离目标1米左右的轨道上运转，流星会自动躲避运动轨迹上的障碍，如果绝对无法规避，则会撞毁在障碍上并造成物理伤害。只要有任意一颗流星仍在运转，流星会提供一种略微的干扰，使任意针对目标的攻击检定获得-3的减值。每回合目标可以选择令一颗流星坠向指定地点并造成伤害，指向生物时，视为一次远程攻击"
    },
    "effect": {
      "流星之幕": null
    }
  },
  "effect_rain_of_stars": {
    "uid": "effect_rain_of_stars",
    "name": "创星雨",
    "quality": "唯一",
    "type": "主动",
    "tags": ["塑能系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "攻击"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": "见下文",
      "on_save": "成功伤害减半"
    },
    "damage": "300每颗",
    "target_limit": ["爆发"],
    "is_harmless": false,
    "duration": {
      "raw": "7轮或直到消耗"
    },
    "overall_desc" : "",
    "effect_desc": {
      "创星雨": "创造5d20颗微型流星，按照掷骰结果依次为红、绿、橙、蓝、紫色星星的数量。每一轮施法者可以指定一种颜色的星星全部落下，造成伤害以及属性伤害，每颗星星单独计算，免疫伤害的目标同样免疫属性伤害，成功的豁免使得伤害减半，具体效果如下：",
        "红": "造成火焰伤害和1d2点力量伤害，敏捷豁免",
        "绿": "造成寒冷伤害和1d2点敏捷伤害，体质豁免",
        "橙": "造成酸蚀伤害和1d2点体质伤害，智力/精神豁免",
        "蓝": "造成毒素伤害和1d2点智力/精神伤害，精神豁免",
        "紫": "造成电击伤害和1d2点精神伤害，力量豁免"
    },
    "effect": {
      "创星雨": null
    }
  },
  "effect_manipulate_gravity_hidden": {
    "uid": "effect_manipulate_gravity_hidden",
    "name": "操纵引力",
    "quality": "唯一",
    "type": "主动",
    "tags": ["变化系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "攻击"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 25000,
      "sp": 0
    },
    "save_type": {
      "type": "力量/敏捷/无，见下文",
      "on_save": "失败则被捕获"
    },
    "target_limit": ["爆发"],
    "is_harmless": false,
    "duration": {
      "raw": "1轮/等级"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "施法者可以使数量等同于他CL的生物免受影响"
      }
    },
    "overall_desc" : "星球间的引力尽你在掌握之中",
    "effect_desc": {
      "引力场": "此效果咒字创造一片的引力场，每轮你可以决定引力的方向和引力系数(范围在0-100之间)。引力场中所有未固定的生物和物品均被引力捕获，固定或会飞行的生物进行dc={25+引力系数}的力量检定，失败同样被捕获，一直到边缘。如果边缘无阻挡，则会浮在边缘震荡，如果因为阻碍他们不能到达边缘，则这些生物撞上阻碍物并受到坠落伤害(伤害公式：重力系数x{每三米100点伤害，最高8000点})。只要包含此效果咒字的咒字法术还在生效，任何试图进入范围内的物体都会立刻受到引力效果影响。处在范围内的生物每回合进行一次dc=10+引力系数的体质豁免，失败则身体被引力撕裂，受到生命上限{引力系数/2}%的力场伤害。经过此区域的远程攻击自动失手。施法者对此效果免疫，并能自由进入区域。",
      "高引力环境": "高于10倍的引力下，行动会受到严重影响。范围内受影响目标每次消耗[攻击]或[动作]时进行dc=10+引力系数的体质豁免，失败则因为引力影响自动失手，并受到生命上限{引力系数/2}%的力场伤害。成功的检定改为行动受到{引力系数/2}点减值，并使受到的力场伤害减半。经过此区域的远程攻击自动失手。"
    },
    "effect": {
      "引力场": null
    }
  },
  "effect_supernova_hidden": {
    "uid": "effect_supernova_hidden",
    "name": "超新星",
    "quality": "唯一",
    "type": "主动",
    "tags": ["变化系", "智力/精神"],
    "damage": null,
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "攻击"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 40000,
      "sp": 0
    },
    "save_type": {
      "type": "体质或意志，见下文",
      "on_save": "无"
    },
    "target_limit": ["爆发"],
    "is_harmless": false,
    "duration": {
      "raw": "1分钟/等级"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "施法者使数量等同于他CL的生物免受影响，并使持续时间提升到10分钟/等级。消耗20000mp",
        "extra_cost": {
          "mp": 20000,
          "hp": 0,
          "sp": 0
        }
      }
    },
    "overall_desc" : "超新星！你掌握了毁灭的真谛",
    "effect_desc": {
      "超新星": "在指定地点模拟超新星爆发。对目标造成上限80%的HP MP SP 伤害，成功的体质豁免可以使伤害减少为上限的60%。高额的辐射、粒子和能量震荡区域，除了你自己携带或者接触的物品外，其余所有魔法效果和魔法物品遭到裂解，法术/类法术/超自然效果会被完全摧毁，效果立刻终止，而永久性魔法物品必须进行精神豁免(被持有时精神值取持有者)，失败则在持续时间内被还原为一般物品。如果物品的豁免检定掷出1点，则被永久摧毁而非压制。冲击会震荡时空结构，所有时间/空间类效果在持续时间内产生不可预料的后果"
    },
    "effect": {
      "超新星": null
    }
  },
}