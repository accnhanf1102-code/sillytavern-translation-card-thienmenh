export const TARGET_WORDS_DB = 
{
  "target_personal": {
    "uid": "target_personal",
    "name": "个人",
    "quality_limit": "普通",
    "range_desc": null,
    "target_desc": "包含此目标咒字的法术仅影响施法者",
    "boost": {
      "total_level": 0
    }
  },
  "target_select": {
    "uid": "target_select",
    "name": "选择",
    "quality_limit": "普通",
    "range_desc": "近距(9米 + 2米/2CL)",
    "target_desc": "影响范围中的一个单体目标，如果咒字法术造成能量伤害，此咒字产生一道需要远程接触攻击的射线",
    "boost": {
      "total_level": 1,
      "1": {
        "rep_target_desc": "咒字影响最多每CL1个目标，且不能有两个目标之间超过9米远。距离增加为中距(30米+3米/CL)。如果咒字法术造成能量伤害，施法者必须为每个目标分别做射线攻击。此增强目标咒字将法术消耗提高3000mp",
        "extra_cost": {
          "mp": 3000,
          "hp": 0,
          "sp": 0
        }
      }
    }
  },
  "target_follow": {
    "uid": "target_follow",
    "name": "附随",
    "quality_limit": "优良",
    "range_desc": "近距(9米 + 2米/2CL)",
    "target_desc": "影响以选定目标为中心半径3米内的全部目标(施法可以选择中心目标是否会受到影响)，法术效果跟随选定目标的移动而移动。只有具有持续时间的效果咒字会跟随移动，没有持续时间的效果立刻生效。施法者进入范围内同样会受到影响",
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "影响半径扩大为9米，可以选择等同于你CL的目标不受影响"
      }
    }
  },
    "target_item_enchant": {
    "uid": "target_item_enchant",
    "name": "注能",
    "quality_limit": "优良",
    "range_desc": "接触",
    "target_desc": "此目标咒字可以影响影响接触的一个物品。将法术暂存在物品中，随后可以在任意一次攻击过程中释放。注魔可以保持10轮或直到消耗。成功的命中会释放法术并消耗注能，失手则可以保持能量继续尝试",
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "距离增加为中距(30米+3米/CL)。你可以为自愿的其他生物手中的物品注能",
        "extra_cost": {
          "mp": 0,
          "hp": 0,
          "sp": 0
        }
      }
    }
  },
  "target_wall": {
    "uid": "target_wall",
    "name": "墙",
    "quality_limit": "稀有",
    "range_desc": "近距(9米 + 2米/2CL)",
    "target_desc": "此目标咒字制造一个可视的墙体，每CL 3米长，3米高。接触或穿过墙体的生物受到法术效果的影响。墙体不阻挡生物穿过。在法术施展时占用目标区域的生物受到法术效果的影响。墙体宽1尺，必须和稳固表面连接，且在创造时必须为笔直",
    "boost": {
      "total_level": 1,
      "1": {
        "rep_target_desc": "墙体每CL变为6米长，6米宽。墙体能被塑造为任何形状，但是必须仍然保持垂直表面",
        "extra_cost": {
          "mp": 0,
          "hp": 0,
          "sp": 0
        }
      }
    }
  },
  "target_burst": {
    "uid": "target_burst",
    "name": "爆发",
    "quality_limit": "优良",
    "range_desc": "近距(9米 + 2米/2CL)",
    "target_desc": "此目标咒字影响3米半径中的所有目标。如果选用爆发的效果咒字会产生发散物或遗留效果，占用同样的爆发区域，并在持续时间内保持对范围内生效，且在创造后不能移动",
    "boost": {
      "total_level": 3,
      "1": {
        "rep_target_desc": "法术影响所有6米半径的爆发区域。距离增加为中距(30米+3米/CL)。增强此咒字将消耗提高3000mp",
        "extra_cost": {
          "mp": 3000,
          "hp": 0,
          "sp": 0
        }
      },
      "2": {
        "rep_target_desc": "法术影响所有12米半径的爆发区域。距离增加为远距(120米+12米/CL)。增强此咒字将它的消耗提高6000mp",
        "extra_cost": {
          "mp": 6000,
          "hp": 0,
          "sp": 0
        }
      },
      "limit": {
        "add_desc": "(第四层级以上可选)影响范围不限。释法距离不限。额外消耗50%最大mp",
        "extra_cost": {
          "mp": 0,
          "hp": 0,
          "sp": 0
        }
      }
    }
  },
  "target_shape": {
    "uid": "target_shape",
    "name": "塑形",
    "quality_limit": "普通",
    "range_desc": "最大边长6米的正方体",
    "target_desc": "选择一个简单几何体作为目标范围(不得超过最大体积)。此目标咒字影响范围内的生物。与爆发不同，通常不会在范围内残留效果",
    "boost": {
      "total_level": 3,
      "1": {
        "rep_range_desc": "边长增加为12米。消耗提高 3000mp",
        "extra_cost": {
          "mp": 3000,
          "hp": 0,
          "sp": 0
        }
      },
      "2": {
        "rep_range_desc": "边长增加为24米。消耗提高 6000mp",
        "extra_cost": {
          "mp": 6000,
          "hp": 0,
          "sp": 0
        }
      },
      "limit": {
        "add_desc": "(第四层级以上可选)边长增加为不限。消耗提高最大mp的50%",
        "extra_cost": {
          "mp": 0,
          "hp": 0,
          "sp": 0
        }
      }
    }
  },
  "target_free": {
    "uid": "target_free",
    "name": "自由",
    "quality_limit": "史诗",
    "range_desc": "自定义",
    "target_desc": "你对咒字的理解无人能及，你可以自己定义目标范围以及法术形态",
    "boost": {
      "total_level": 0
    }
  },
  "target_curtain_of_stars_hidden": {
    "uid": "target_curtain_of_stars_hidden",
    "name": "繁星帷幕",
    "quality_limit": "史诗",
    "range_desc": "远距(120米+12米/CL)",
    "target_desc": "在范围内，划定周长不超过每CL24米的区域被无形的繁星帷幕遮掩，并创造出5颗包含完整组合法术的星星(目标咒字视为'选择')。从视觉上完全不可见(可以被识破隐形效果发现，且具有中等魔法灵光。如果在黑夜中，无法被识破只具有暗淡魔法灵光)。任何进入帷幕的生物会受到类似迷宫术效果的影响，每轮可以进行DC=30的智力检定尝试逃脱，如果检定失败，将消耗一颗星星并被星星攻击。在没有生物进入时，帷幕可以维持无限时间，首个生物进入后开始计时，在10分钟后或者全部星星被消耗后自然消失，你可以随时解除它",
    "boost": {
      "total_level": 0
    }
  }
}