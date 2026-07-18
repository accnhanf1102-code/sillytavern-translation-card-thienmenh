export const EFFECT_WORDS_DB = 
{
  "effect_force_shield": {
    "uid": "effect_force_shield",
    "name": "Lực Trường Kết Giới",
    "quality": "Epic",
    "type": "Bị động",
    "tags": ["Hệ Phòng Hộ", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Cá nhân", "Lựa chọn"],
    "is_harmless": true,
    "duration": {
      "raw": "10 phút/cấp độ"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Lực Trường Phòng Hộ": "Mục tiêu nhận được +6 điểm cộng giáp, và mỗi 4 CL +1, có hiệu quả với thực thể hư ảo. Nếu mục tiêu nhận được điểm cộng giáp cao hơn từ các nguồn khác, thay vào đó hãy tăng điểm cộng giáp đó thêm 2 điểm và khiến nó có thể phòng ngự các đòn tấn công từ thực thể hư ảo."
    },
    "effect": {
      "Lực Trường Phòng Hộ": null
    }
  },
  "effect_permanent_paralysis": {
    "uid": "effect_permanent_paralysis",
    "name": "Tê Liệt Vĩnh Viễn",
    "quality": "Unique",
    "type": "Bị động",
    "tags": ["Hệ Mê Hoặc", "Ép buộc", "Ảnh hưởng tâm trí", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": "Ý chí",
      "on_save": "Vô hiệu nếu vượt qua"
    },
    "target_limit": ["Lựa chọn"],
    "is_harmless": false,
    "duration": {
      "raw": "Vĩnh viễn"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Tê Liệt Vĩnh Viễn": "Mục tiêu bị tê liệt, không thể di chuyển. Đối tượng có thể cảm nhận môi trường xung quanh và thở bình thường, nhưng không thể thực hiện bất kỳ hành động nào. Có thể ảnh hưởng đến mọi loại sinh vật, và thời gian duy trì là vĩnh viễn. Mục tiêu bị ảnh hưởng sẽ nhận được một lượt cứu nguy Ý chí bổ sung sau khi kết thúc vòng thứ hai kể từ lần cứu nguy đầu tiên thất bại. Lượt cứu nguy này chỉ dùng để chấm dứt hiệu quả của chú tự này, không phải các hiệu quả khác của cùng chú tự pháp thuật. Nếu lần cứu nguy thứ hai cũng thất bại, thì hiệu quả của chú tự này chỉ có thể được hóa giải bằng Giải Pháp Thuật Cấp Cao (Greater Dispel Magic), Phép Màu (Miracle) hoặc Điều Ước (Wish)."
    },
    "effect": {
      "Tê Liệt Vĩnh Viễn": null
    }
  },
  "effect_energy_resistance": {
    "uid": "effect_energy_resistance",
    "name": "Kháng Năng Lượng",
    "quality": "Rare",
    "type": "Bị động",
    "tags": ["Hệ Phòng Hộ", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 800,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Cá nhân", "Lựa chọn"],
    "is_harmless": true,
    "duration": {
      "raw": "10 phút/cấp độ"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Kháng Năng Lượng": "Mục tiêu nhận được 20% kháng tính khi đối kháng với một loại nguyên tố. Tuy nhiên vẫn sẽ phải chịu các hiệu ứng đặc biệt đi kèm sát thương năng lượng."
    },
    "effect": {
      "Miễn Nhiễm Nguyên Tố": null
    }
  },
  "effect_elemental_immunity": {
    "uid": "effect_elemental_immunity",
    "name": "Miễn Nhiễm Nguyên Tố",
    "quality": "Epic",
    "type": "Bị động",
    "tags": ["Hệ Phòng Hộ", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 5000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Cá nhân", "Lựa chọn"],
    "is_harmless": true,
    "duration": {
      "raw": "1 vòng/cấp độ"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Kháng tính tăng lên 40%"
      }
    },
    "effect_desc": {
      "Miễn Nhiễm Nguyên Tố": "Mục tiêu miễn nhiễm với một loại sát thương năng lượng được chỉ định. Tuy nhiên vẫn sẽ phải chịu các hiệu ứng đặc biệt đi kèm sát thương năng lượng."
    },
    "effect": {
      "Miễn Nhiễm Nguyên Tố": null
    }
  },
  "effect_perfect_form": {
    "uid": "effect_perfect_form",
    "name": "Hình Thái Hoàn Mỹ",
    "quality": "Mythic",
    "type": "Bị động",
    "tags": ["Hệ Biến Hóa", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 0,
      "swift": 0,
      "free": 0,
      "multi_turn": "Thời gian thi triển 10 phút",
      "raw": ""
    },
    "extra_cost": {
      "hp": 0,
      "mp": 25000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Cá nhân", "Lựa chọn"],
    "is_harmless": true,
    "duration": {
      "raw": "Vĩnh viễn"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Hình Thái Hoàn Mỹ": "Tất cả các kiểm định thuộc tính của mục tiêu nhận được +6 điểm cộng tăng cường (enhancement bonus).",
      "Mô tả bổ sung": "Thời gian thi triển: 10 phút"
    },
    "effect": {
      "Hình Thái Hoàn Mỹ": null
    }
  },
  "effect_cold_snap": {
    "uid": "effect_cold_snap",
    "name": "Sương Giá Đột Ngột",
    "quality": "Rare",
    "type": "Chủ động",
    "tags": ["Hệ Tố Năng", "Trí Tuệ/Tinh Thần"],
    "damage": "100 mỗi CL",
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "Tấn công"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 500,
      "sp": 0
    },
    "save_type": {
      "type": "Không hoặc Thể chất",
      "on_save": "Miễn trừ hiệu quả"
    },
    "target_limit": ["Cá nhân", "Lựa chọn"],
    "is_harmless": false,
    "duration": {
      "raw": "Không"
    },
    "effect_desc": {
      "Giá Lạnh": "Gây sát thương giá lạnh. Mục tiêu thất bại trong kiểm định cứu nguy sẽ bị choáng váng trong 1 vòng (chỉ có thể thực hiện di chuyển hoặc tấn công)."
    },
    "effect": {
      "Giá Lạnh": null
    }
	},
  "effect_force_ball": {
    "uid": "effect_force_ball",
    "name": "Cầu Lực Trường",
    "quality": "Rare",
    "type": "Chủ động",
    "tags": ["Hệ Tố Năng", "Trí Tuệ/Tinh Thần"],
    "damage": "50 mỗi CL",
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "Tấn công"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 500,
      "sp": 0
    },
    "save_type": {
      "type": "Không hoặc Sức mạnh",
      "on_save": "Miễn trừ hiệu quả"
    },
    "target_limit": ["Cá nhân", "Lựa chọn"],
    "is_harmless": false,
    "duration": {
      "raw": "Không"
    },
    "effect_desc": {
      "Xung Kích Lực Trường": "Mỗi 4 CL tạo ra một quả cầu lực trường tấn công mục tiêu, gây sát thương lực trường. Mỗi lần bị trúng đích, mục tiêu cần thực hiện kiểm định Sức mạnh, thất bại sẽ bị đẩy lùi và ngã gục. Nếu bị chặn bởi chướng ngại vật, nhận sát thương vật lý tỷ lệ thuận với lực va chạm/trọng lượng/chất liệu chướng ngại vật."
    },
    "effect": {
      "Xung Kích Lực Trường": null
    }
  },
  "effect_drain_life": {
    "uid": "effect_drain_life",
    "name": "Hút Sinh Lực",
    "quality": "Mythic",
    "type": "Chủ động",
    "tags": ["Hệ Tử Linh", "Trí Tuệ/Tinh Thần"],
    "damage": "5000",
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "Tấn công"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Cá nhân", "Lựa chọn"],
    "is_harmless": false,
    "duration": {
      "raw": "Tức thì"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Hồi phục HP, MP, SP bằng một nửa sát thương gây ra"
      }
    },
    "effect_desc": {
      "Hút Sinh Lực": "Hồi phục HP bằng một nửa sát thương gây ra."
    },
    "effect": {
      "Hút Sinh Lực": null
    }
  },
  "effect_cataclysm": {
    "uid": "effect_cataclysm",
    "name": "Tai Biến",
    "quality": "Unique",
    "type": "Chủ động",
    "tags": ["Hệ Tố Năng", "Trí Tuệ/Tinh Thần"],
    "damage": "6000",
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "Tấn công"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": "Nhanh nhẹn",
      "on_save": "Giảm một nửa sát thương"
    },
    "target_limit": ["Bộc phát"],
    "is_harmless": false,
    "duration": {
      "raw": "1 vòng/cấp độ"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Tai Biến": "Khiến khu vực bao phủ bởi mây đen, mưa lớn và mưa đá trút xuống, che khuất tầm nhìn và ngăn chặn mọi đòn tấn công tầm xa. Tấn công cận chiến bị giảm 20% tỷ lệ trúng. Sinh vật trong phạm vi chịu sát thương hỗn hợp vật lý và băng giá từ mưa đá khi bắt đầu vòng đầu tiên. Ngoài ra, mỗi vòng người thi triển có thể giáng xuống một tia sét gây sát thương điện, có thể đánh trúng bất kỳ số lượng mục tiêu nào và phân chia tỷ lệ sát thương tùy ý. Mục tiêu có thể thực hiện kiểm định Nhanh nhẹn để giảm một nửa sát thương. Mục tiêu thất bại trong kiểm định sẽ bị ngã gục do lực va chạm. Trong thời gian duy trì, địa hình trong phạm vi chú tự này được coi là địa hình khó, ngoại trừ người thi triển."
    },
    "effect": {
      "Tai Biến": null
    }
  },
  "effect_touch_of_life": {
    "uid": "effect_touch_of_life",
    "name": "Chạm Hồi Sinh",
    "quality": "Mythic",
    "type": "Chủ động",
    "tags": ["Hệ Chú Pháp", "Y tế", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Lựa chọn"],
    "is_harmless": true,
    "duration": {
      "raw": "Tức thì"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Chạm Hồi Sinh": "Có thể làm sống lại vật chết, linh hồn của mục tiêu có thể nhìn thấy hình dạng của người thi triển và chọn không hồi sinh, khiến chú tự pháp thuật thất bại. Áp dụng cho sinh vật đã chết tối đa 1 ngày/CL. Sinh vật được hồi sinh sẽ phục hồi một nửa HP gốc và cơ thể không cần phải nguyên vẹn (chỉ cần một mảnh nhỏ của sinh vật này). Những bộ phận thiếu trước khi sinh vật chết sẽ không được phục hồi qua hiệu ứng chú tự này. Mục tiêu phải chịu 1 cấp độ âm (negative level) qua hiệu ứng chú tự này, cấp độ âm sẽ biến mất sau 24 giờ (có thể bị loại bỏ sớm hơn bằng cách khác). Sinh vật giữ lại ký ức, kỹ năng, MP, SP trước khi chết."
    },
    "effect": {
      "Chạm Hồi Sinh": null
    }
  },
  "effect_dimension_door": {
    "uid": "effect_dimension_door",
    "name": "Cổng Chiều Không Gian",
    "quality": "Mythic",
    "type": "Chủ động",
    "tags": ["Hệ Chú Pháp", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Bộc phát"],
    "is_harmless": false,
    "duration": {
      "raw": "1 vòng/cấp độ"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Cổng Chiều Không Gian": "Tạo ra một cánh cổng kết nối vị diện nơi người thi triển đang ở với các vị diện khác (hoặc chính vị diện đó). Khi cánh cổng được mở, sinh vật, phép thuật, hiệu ứng và vật thể ở cả hai nơi đều có thể tự do đi qua. Cánh cổng hiện ra dưới dạng một khoảng trống lan tỏa từ chính giữa phép thuật. Người thi triển không thể dự đoán tình hình phía đối diện và không thể trực tiếp kiểm soát việc đóng cổng (trừ khi sử dụng các hiệu ứng kiểu Giải trừ Phép thuật)."
    },
    "effect": {
      "Cổng Chiều Không Gian": null
    }
  },
  "effect_haste_time": {
    "uid": "effect_haste_time",
    "name": "Gia Tốc Thời Gian",
    "quality": "Epic",
    "type": "Bị động",
    "tags": ["Hệ Biến Hóa", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Lựa chọn"],
    "is_harmless": true,
    "duration": {
      "raw": "1 vòng/cấp độ"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Nếu mục tiêu thực hiện tấn công toàn lực, có thể sử dụng chỉ số tấn công cao nhất để thực hiện một đòn tấn công bổ sung thay thế cho hành động di chuyển bổ sung đó."
      }
    },
    "effect_desc": {
      "Gia Tốc Thời Gian": "Mục tiêu của chú tự pháp thuật mang hiệu ứng này có thể thực hiện thêm một [Hành động] mỗi vòng. Hành động này có thể thực hiện trước, sau hoặc giữa các hành động khác, nhưng không thể thực hiện trong toàn bộ hành động của vòng."
    },
    "effect": {
      "Gia Tốc Thời Gian": null
    }
  },
  "effect_slow_time": {
    "uid": "effect_slow_time",
    "name": "Giảm Tốc Thời Gian",
    "quality": "Epic",
    "type": "Bị động",
    "tags": ["Hệ Biến Hóa", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "save_type": {
      "type": "Ý chí",
      "on_save": "Vô hiệu nếu vượt qua"
    },
    "target_limit": ["Lựa chọn"],
    "is_harmless": false,
    "duration": {
      "raw": "1 vòng/cấp độ"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Mục tiêu không thể thực hiện thêm cứu nguy để kết thúc hiệu ứng. Nếu thất bại trong lần cứu nguy đầu tiên, mục tiêu sẽ rơi vào trạng thái choáng váng trong toàn bộ thời gian duy trì của chú tự pháp thuật."
      }
    },
    "effect_desc": {
      "Giảm Tốc Thời Gian": "Mục tiêu rơi vào trạng thái choáng váng trong thời gian duy trì hiệu ứng chú tự này, chỉ có thể thực hiện một [Tấn công] hoặc [Hành động]. Mỗi cuối vòng có thể thực hiện một kiểm định cứu nguy mới để kết thúc hiệu ứng."
    },
    "effect": {
      "Giảm Tốc Thời Gian": null
    }
  },
  "effect_borrow_future": {
    "uid": "effect_borrow_future",
    "name": "Ứng Trước Tương Lai",
    "quality": "Legendary",
    "type": "Bị động",
    "tags": ["Hệ Biến Hóa", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 8000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Lựa chọn"],
    "is_harmless": true,
    "duration": {
      "raw": "Tức thì"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Mục tiêu rơi vào trạng thái choáng váng ở lượt tiếp theo, chỉ có thể thực hiện một [Tấn công] hoặc [Hành động] thay vì hoàn toàn không thể hành động."
      }
    },
    "effect_desc": {
      "Ứng Trước Tương Lai": "Sau khi thi triển chú tự, mục tiêu ngay lập tức nhận được một đòn tấn công và một hành động (tối đa 1 lần/vòng). Mục tiêu bỏ qua lượt tiếp theo của mình, nhưng mọi hiệu ứng phát sinh trong lượt của mục tiêu, hoặc các hiệu ứng phép thuật kết thúc trong lượt đó vẫn có hiệu lực bình thường. Mục tiêu không bất lực trong lượt tiếp theo nhưng không thể thực hiện bất kỳ hành động nào. Nếu mục tiêu chưa hành động trong vòng này, sẽ ứng trước hành động của vòng này; nếu đã hành động, sẽ ứng trước vòng tiếp theo."
    },
    "effect": {
      "Ứng Trước Tương Lai": null
    }
  },
  "effect_manipulate_time": {
    "uid": "effect_manipulate_time",
    "name": "Thao Túng Thời Gian",
    "quality": "Unique",
    "type": "Bị động",
    "tags": ["Hệ Biến Hóa", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 25000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Lựa chọn"],
    "is_harmless": true,
    "duration": {
      "raw": "Tức thì"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Thao Túng Thời Gian": "Thời gian bao quanh mục tiêu mang hiệu ứng chú tự này ngưng đọng, cho phép mục tiêu thực hiện 4 [Tấn công] hoặc [Hành động] trước khi thời gian trôi chảy trở lại. Các hành động bổ sung có thể được sử dụng để tiếp tục thi triển Thao Túng Thời Gian. Tất cả các sinh vật và vật thể khác đều miễn nhiễm với hành động của mục tiêu trong các hành động bổ sung này. Mục tiêu thường thi triển phép thuật lên bản thân, sử dụng vật phẩm hoặc chạy trốn trong thời gian này. Mục tiêu có thể chọn kết thúc hiệu ứng phép thuật sớm, lúc này có thể chọn một hiệu ứng tác động lên mục tiêu khác làm hành động cuối cùng."
    },
    "effect": {
      "Thao Túng Thời Gian": null
    }
  },
  "effect_negation_dispelling": {
    "uid": "effect_negation_dispelling",
    "name": "Phủ Quyết",
    "quality": "Unique",
    "type": "Bị động",
    "tags": ["Hệ Phòng Hộ", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "Tấn công"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 15000,
      "sp": 0
    },
    "save_type": {
      "type": null,
      "on_save": "Không"
    },
    "target_limit": ["Lựa chọn"],
    "is_harmless": true,
    "duration": {
      "raw": "Tức thì"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Thao Túng Thời Gian": "Thời gian bao quanh mục tiêu mang hiệu ứng chú tự này ngưng đọng, cho phép mục tiêu thực hiện 4 [Tấn công] hoặc [Hành động] trước khi thời gian trôi chảy trở lại. Các hành động bổ sung có thể được sử dụng để tiếp tục thi triển Thao Túng Thời Gian. Tất cả các sinh vật và vật thể khác đều miễn nhiễm với hành động của mục tiêu trong các hành động bổ sung này. Mục tiêu thường thi triển phép thuật lên bản thân, sử dụng vật phẩm hoặc chạy trốn trong thời gian này. Mục tiêu có thể chọn kết thúc hiệu ứng phép thuật sớm, lúc này có thể chọn một hiệu ứng tác động lên mục tiêu khác làm hành động cuối cùng."
    },
    "effect": {
      "Thao Túng Thời Gian": null
    }
  },
  "effect_veil_of_meteors": {
    "uid": "effect_veil_of_meteors",
    "name": "Màn Lưu Tinh",
    "quality": "Rare",
    "type": "Chủ động",
    "tags": ["Hệ Tố Năng", "Trí Tuệ/Tinh Thần"],
    "damage": "200 mỗi viên",
    "action_cost": {
      "standard": 0,
      "move": 1,
      "swift": 0,
      "free": 0,
      "raw": "Hành động"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 800,
      "sp": 0
    },
    "save_type": {
      "type": "Không",
      "on_save": ""
    },
    "target_limit": ["Bộc phát"],
    "is_harmless": false,
    "duration": {
      "raw": "1 phút/cấp độ hoặc cho đến khi tiêu thụ"
    },
    "effect_desc": {
      "Màn Lưu Tinh": "Tạo ra 10 viên lưu tinh siêu nhỏ, bay lượn và xoay quanh mục tiêu trong quỹ đạo khoảng 1 mét. Lưu tinh sẽ tự động tránh chướng ngại vật trên quỹ đạo di chuyển, nếu tuyệt đối không thể tránh né, chúng sẽ va chạm vào chướng ngại vật và gây sát thương vật lý. Miễn là có ít nhất một lưu tinh đang xoay, lưu tinh sẽ gây nhiễu nhẹ, khiến mọi kiểm định tấn công nhắm vào mục tiêu bị giảm 3 điểm. Mỗi vòng, mục tiêu có thể chọn cho một lưu tinh rơi xuống địa điểm chỉ định và gây sát thương. Khi nhắm vào sinh vật, được coi là một đòn tấn công tầm xa."
    },
    "effect": {
      "Màn Lưu Tinh": null
    }
  },
  "effect_rain_of_stars": {
    "uid": "effect_rain_of_stars",
    "name": "Mưa Lưu Tinh Sáng Tạo",
    "quality": "Unique",
    "type": "Chủ động",
    "tags": ["Hệ Tố Năng", "Trí Tuệ/Tinh Thần"],
    "damage": "300 mỗi viên",
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "Tấn công"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": "Xem bên dưới",
      "on_save": "Thành công giảm một nửa sát thương"
    },
    "target_limit": ["Bộc phát"],
    "is_harmless": false,
    "duration": {
      "raw": "7 vòng hoặc cho đến khi tiêu thụ"
    },
    "overall_desc": "",
    "effect_desc": {
      "Mưa Lưu Tinh Sáng Tạo": "Tạo ra 5d20 viên lưu tinh siêu nhỏ, số lượng các sao màu đỏ, xanh lá, cam, xanh dương và tím dựa trên kết quả gieo xúc xắc tương ứng. Mỗi vòng, người thi triển có thể chỉ định tất cả các ngôi sao cùng màu rơi xuống, gây sát thương và sát thương thuộc tính; mỗi viên sao được tính riêng biệt. Mục tiêu miễn nhiễm sát thương cũng miễn nhiễm sát thương thuộc tính. Cứu nguy thành công giúp giảm một nửa sát thương. Hiệu ứng cụ thể như sau:",
      "Đỏ": "Gây sát thương lửa và 1d2 điểm sát thương Sức mạnh, cứu nguy Nhanh nhẹn.",
      "Xanh lá": "Gây sát thương băng giá và 1d2 điểm sát thương Nhanh nhẹn, cứu nguy Thể chất.",
      "Cam": "Gây sát thương axit và 1d2 điểm sát thương Thể chất, cứu nguy Trí Tuệ/Tinh Thần.",
      "Xanh dương": "Gây sát thương độc tố và 1d2 điểm sát thương Trí Tuệ/Tinh Thần, cứu nguy Tinh Thần.",
      "Tím": "Gây sát thương điện và 1d2 điểm sát thương Tinh Thần, cứu nguy Sức mạnh."
    },
    "effect": {
      "Mưa Lưu Tinh Sáng Tạo": null
    }
  },
  "effect_manipulate_gravity_hidden": {
    "uid": "effect_manipulate_gravity_hidden",
    "name": "Thao Túng Trọng Lực",
    "quality": "Unique",
    "type": "Chủ động",
    "tags": ["Hệ Biến Hóa", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "Tấn công"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 25000,
      "sp": 0
    },
    "save_type": {
      "type": "Sức mạnh/Nhanh nhẹn/Không, xem bên dưới",
      "on_save": "Thất bại thì bị bắt giữ"
    },
    "target_limit": ["Bộc phát"],
    "is_harmless": false,
    "duration": {
      "raw": "1 vòng/cấp độ"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Người thi triển có thể khiến số lượng sinh vật tương đương CL của mình miễn nhiễm với ảnh hưởng."
      }
    },
    "overall_desc": "Trọng lực giữa các vì sao nằm trong lòng bàn tay bạn.",
    "effect_desc": {
      "Trường Trọng Lực": "Chú tự này tạo ra một trường trọng lực. Mỗi vòng, bạn có thể quyết định hướng và hệ số trọng lực (trong khoảng 0-100). Mọi sinh vật và vật thể không cố định trong trường đều bị trọng lực bắt giữ. Sinh vật cố định hoặc đang bay phải thực hiện kiểm định Sức mạnh DC={25+hệ số trọng lực}, thất bại sẽ bị bắt giữ cho đến rìa trường. Nếu rìa không có chướng ngại, chúng sẽ lơ lửng rung lắc ở rìa; nếu vì vật cản mà không thể đến rìa, chúng sẽ va chạm vào vật cản và chịu sát thương rơi (công thức: hệ số trọng lực x {100 điểm sát thương mỗi 3 mét, tối đa 8000 điểm}). Miễn là chú tự này còn hiệu lực, bất kỳ vật thể nào cố gắng tiến vào phạm vi đều ngay lập tức bị ảnh hưởng. Sinh vật trong phạm vi thực hiện kiểm định Thể chất DC=10+hệ số trọng lực mỗi vòng, thất bại sẽ bị trọng lực xé nát cơ thể, chịu sát thương lực trường bằng {hệ số trọng lực/2}% máu tối đa. Các đòn tấn công tầm xa đi qua khu vực này tự động trượt. Người thi triển miễn nhiễm hiệu ứng này và có thể tự do ra vào khu vực.",
      "Môi trường Trọng Lực Cao": "Ở trọng lực cao hơn 10 lần, hành động sẽ bị ảnh hưởng nghiêm trọng. Mục tiêu bị ảnh hưởng trong phạm vi mỗi khi tiêu tốn [Tấn công] hoặc [Hành động] phải thực hiện kiểm định Thể chất DC=10+hệ số trọng lực, thất bại sẽ tự động trượt do ảnh hưởng trọng lực và chịu sát thương lực trường bằng {hệ số trọng lực/2}% máu tối đa. Kiểm định thành công giúp thay đổi hình phạt thành {hệ số trọng lực/2} điểm trừ vào hành động, và giảm một nửa sát thương lực trường phải chịu. Tấn công tầm xa qua khu vực này tự động trượt."
    },
    "effect": {
      "Trường Trọng Lực": null
    }
  },
  "effect_supernova_hidden": {
    "uid": "effect_supernova_hidden",
    "name": "Siêu Tân Tinh",
    "quality": "Unique",
    "type": "Chủ động",
    "tags": ["Hệ Biến Hóa", "Trí Tuệ/Tinh Thần"],
    "damage": null,
    "action_cost": {
      "standard": 1,
      "move": 0,
      "swift": 0,
      "free": 0,
      "raw": "Tấn công"
    },
    "extra_cost": {
      "hp": 0,
      "mp": 40000,
      "sp": 0
    },
    "save_type": {
      "type": "Thể chất hoặc Tinh thần, xem bên dưới",
      "on_save": "Không"
    },
    "target_limit": ["Bộc phát"],
    "is_harmless": false,
    "duration": {
      "raw": "1 phút/cấp độ"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Người thi triển khiến số lượng sinh vật tương đương CL của mình miễn nhiễm với ảnh hưởng, và tăng thời gian duy trì lên 10 phút/cấp độ. Tiêu tốn thêm 20000 MP.",
        "extra_cost": {
          "mp": 20000,
          "hp": 0,
          "sp": 0
        }
      }
    },
    "overall_desc": "Siêu Tân Tinh! Bạn đã nắm giữ chân lý của sự hủy diệt.",
    "effect_desc": {
      "Siêu Tân Tinh": "Mô phỏng một vụ nổ siêu tân tinh tại địa điểm chỉ định. Gây sát thương tối đa 80% HP, MP, SP cho mục tiêu; cứu nguy Thể chất thành công giúp giảm sát thương xuống còn 60%. Khu vực chịu bức xạ, hạt và chấn động năng lượng cao. Ngoại trừ vật phẩm bạn mang theo hoặc đang chạm vào, tất cả các hiệu ứng phép thuật và vật phẩm ma thuật khác đều bị phân rã; các phép thuật/kỹ năng dạng phép/siêu nhiên bị hủy diệt hoàn toàn và kết thúc ngay lập tức. Các vật phẩm ma thuật vĩnh viễn phải thực hiện cứu nguy Tinh Thần (nếu đang được cầm nắm, chỉ số Tinh thần lấy theo người giữ), thất bại sẽ bị hoàn nguyên thành vật phẩm thông thường trong thời gian hiệu lực. Nếu kết quả cứu nguy là 1, vật phẩm bị hủy diệt vĩnh viễn thay vì chỉ bị áp chế. Vụ nổ làm rung chuyển cấu trúc thời không, mọi hiệu ứng thời gian/không gian trong thời gian duy trì sẽ gây ra những hệ quả không thể lường trước."
    },
    "effect": {
      "Siêu Tân Tinh": null
    }
  },
}