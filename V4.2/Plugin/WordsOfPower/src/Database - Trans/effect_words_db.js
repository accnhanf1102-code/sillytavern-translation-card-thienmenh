export const EFFECT_WORDS_DB = 
{
  "effect_force_shield": {
    "uid": "effect_force_shield",
    "name": "Kết giới lực trường",
    "quality": "Sử thi",
    "type": "Bị động",
    "tags": ["Hệ Phòng hộ", "Trí lực/Tinh thần"],
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
      "raw": "10 phút/cấp"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Bảo vệ lực trường": "AC của mục tiêu nhận được +6 buff giáp, và mỗi 4 CL +1, có hiệu lực với thực thể ảo (hư thể). Nếu mục tiêu nhận được buff giáp cao hơn từ các nguồn khác, thì thay vào đó sẽ tăng buff giáp đó thêm 2 điểm và khiến nó có khả năng phòng thủ các đòn tấn công từ thực thể ảo."
    },
    "effect": {
      "Bảo vệ lực trường": null
    }
  },
  "effect_permanent_paralysis": {
    "uid": "effect_permanent_paralysis",
    "name": "Tê liệt vĩnh viễn",
    "quality": "Duy nhất",
    "type": "Bị động",
    "tags": ["Hệ Hoặc khống", "Bức bách", "Ảnh hưởng tâm trí", "Trí lực/Tinh thần"],
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
      "on_save": "Thành công thì vô hiệu"
    },
    "target_limit": ["Lựa chọn"],
    "is_harmless": false,
    "duration": {
      "raw": "Vô hạn"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Tê liệt vĩnh viễn": "Mục tiêu bị tê liệt, không thể di chuyển. Kẻ đó có thể cảm nhận được các sự vật xung quanh và hô hấp bình thường, nhưng không thể thực hiện bất kỳ hành động nào. Có thể ảnh hưởng đến bất kỳ loại sinh vật nào, và thời gian duy trì là vĩnh viễn. Mục tiêu bị ảnh hưởng sẽ nhận được một lần kiểm định ý chí miễn nhiễm bổ sung vào cuối hiệp thứ hai sau lần kiểm định miễn nhiễm đầu tiên thất bại. Kiểm định miễn nhiễm này chỉ được dùng để chấm dứt hiệu ứng của chú tự này, chứ không phải các chú tự hiệu ứng khác của cùng một phép thuật chú tự. Nếu lần kiểm định thứ hai cũng thất bại, thì hiệu ứng của chú tự này chỉ có thể bị hóa giải bởi Giải trừ ma thuật cao cấp, thuật Kỳ tích hoặc thuật Phép màu (Wish)."
    },
    "effect": {
      "Tê liệt vĩnh viễn": null
    }
  },
  "effect_energy_resistance ": {
    "uid": "effect_energy_resistance",
    "name": "Kháng năng lượng",
    "quality": "Hiếm", 
    "type": "Bị động",
    "tags": ["Hệ Phòng hộ", "Trí lực/Tinh thần"],
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
      "raw": "10 phút/cấp"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Kháng năng lượng": "Mục tiêu nhận được 20% kháng tính khi đối kháng với một loại nguyên tố. Nhưng vẫn sẽ phải chịu các hiệu ứng đặc biệt đi kèm với sát thương năng lượng."
    },
    "effect": {
      "Miễn dịch nguyên tố": null
    }
  },
  "effect_elemental_immunity": {
    "uid": "effect_elemental_immunity",
    "name": "Miễn dịch nguyên tố",
    "quality": "Sử thi",
    "type": "Bị động",
    "tags": ["Hệ Phòng hộ", "Trí lực/Tinh thần"],
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
      "raw": "1 hiệp/cấp"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Miễn dịch nguyên tố": "Mục tiêu miễn dịch với một loại sát thương năng lượng được chỉ định. Nhưng vẫn sẽ phải chịu các hiệu ứng đặc biệt đi kèm với sát thương năng lượng."
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Kháng tính tăng lên 40%"
      }
    },
    "effect": {
      "Miễn dịch nguyên tố": null
    }
  },
  "effect_perfect_form": {
    "uid": "effect_perfect_form",
    "name": "Hình thái hoàn mỹ",
    "quality": "Thần thoại",
    "type": "Bị động",
    "tags": ["Hệ Biến hóa", "Trí lực/Tinh thần"],
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
      "Hình thái hoàn mỹ": "Tất cả các kiểm định thuộc tính của mục tiêu nhận được +6 buff tăng cường.",
      "Mô tả bổ sung": "Thời gian thi triển: 10 phút"
    },
    "effect": {
      "Hình thái hoàn mỹ": null
    }
  },
  "effect_cold_snap": {
    "uid": "effect_cold_snap",
    "name": "Sương giá đột ngột",
    "quality": "Hiếm",
    "type": "Chủ động",
    "tags": ["Hệ Tố năng", "Trí lực/Tinh thần"],
    "damage": "Mỗi CL 100",
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
      "on_save": "Miễn trừ hiệu ứng"
    },
    "target_limit": ["Cá nhân", "Lựa chọn"],
    "is_harmless": false,
    "duration": {
      "raw": "Không"
    },
    "effect_desc": {
      "Lạnh giá": "Gây sát thương lạnh giá. Mục tiêu thất bại kiểm định miễn nhiễm sẽ bị choáng váng 1 hiệp (chỉ có thể thực hiện di chuyển hoặc tấn công)."
    },
    "effect": {
      "Lạnh giá": null
    }
  },
  "effect_force_ball": {
    "uid": "effect_force_ball",
    "name": "Quả cầu lực trường",
    "quality": "Hiếm",
    "type": "Chủ động",
    "tags": ["Hệ Tố năng", "Trí lực/Tinh thần"],
    "damage": "Mỗi CL 50",
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
      "on_save": "Miễn trừ hiệu ứng"
    },
    "target_limit": ["Cá nhân", "Lựa chọn"],
    "is_harmless": false,
    "duration": {
      "raw": "Không"
    },
    "effect_desc": {
      "Xung kích lực trường": "Mỗi 4 CL tạo ra một quả cầu lực trường tấn công mục tiêu, gây sát thương lực trường. Mỗi lần bị đánh trúng, mục tiêu đều cần thực hiện kiểm định miễn nhiễm Sức mạnh, thất bại sẽ bị đẩy lùi và ngã gục. Nếu bị vật cản chặn lại, sẽ chịu sát thương vật lý tỷ lệ thuận với lực xung kích / trọng lượng / chất liệu vật cản."
    },
    "effect": {
      "Xung kích lực trường": null
    }
  },
  "effect_drain_life": {
    "uid": "effect_drain_life",
    "name": "Hấp thụ sinh mệnh",
    "quality": "Thần thoại",
    "type": "Chủ động",
    "tags": ["Hệ Tử linh", "Trí lực/Tinh thần"],
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
      "raw": "Ngay lập tức"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Hồi phục hp, mp, sp bằng một nửa lượng sát thương gây ra."
      }
    },
    "effect_desc": {
      "Hấp thụ sinh mệnh": "Hồi phục hp bằng một nửa lượng sát thương gây ra."
    },
    "effect": {
      "Hấp thụ sinh mệnh": null
    }
  },
  "effect_cataclysm": {
    "uid": "effect_cataclysm",
    "name": "Tai biến",
    "quality": "Duy nhất",
    "type": "Chủ động",
    "tags": ["Hệ Tố năng", "Trí lực/Tinh thần"],
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
      "on_save": "Sát thương giảm một nửa"
    },
    "target_limit": ["Bùng nổ"],
    "is_harmless": false,
    "duration": {
      "raw": "1 hiệp/cấp"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Tai biến": "Làm cho mây đen bao phủ trong phạm vi, mưa to và mưa đá trút xuống từ bầu trời, che khuất tầm nhìn và ngăn cản mọi đòn tấn công tầm xa. Đòn tấn công cận chiến phải chịu 20% tỷ lệ trượt. Các sinh vật trong phạm vi sẽ phải chịu sát thương vật lý và lạnh giá hỗn hợp do mưa đá gây ra vào đầu hiệp đầu tiên. Ngoài ra, mỗi hiệp người thi triển có thể giáng xuống một tia sét gây sát thương điện giật, có thể cho tia sét đánh trúng số lượng mục tiêu tùy ý, và phân bổ tỷ lệ sát thương tùy ý. Mục tiêu có thể thực hiện một lần kiểm định Nhanh nhẹn để giảm một nửa sát thương. Mục tiêu thất bại kiểm định miễn nhiễm đồng thời sẽ bị ngã gục do lực xung kích. Trong thời gian duy trì, địa hình trong phạm vi của chú tự hiệu ứng này được coi là địa hình khó khăn, nhưng ngoại trừ người thi triển."
    },
    "effect": {
      "Tai biến": null
    }
  },
  "effect_touch_of_life": {
    "uid": "effect_touch_of_life",
    "name": "Cái chạm sinh mệnh",
    "quality": "Thần thoại",
    "type": "Chủ động",
    "tags": ["Hệ Chú pháp", "Trị liệu", "Trí lực/Tinh thần"],
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
      "raw": "Ngay lập tức"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Cái chạm sinh mệnh": "Có thể làm cho vật đã chết sống lại, linh hồn của mục tiêu có thể nhìn thấy diện mạo của người thi triển, và có thể chọn không hồi sinh, khiến cho phép thuật chú tự thất bại. Dùng cho sinh vật đã chết tối đa 1 ngày cho mỗi CL. Sinh vật được hồi sinh sẽ hồi phục một nửa HP ban đầu, và cơ thể của kẻ đó không cần phải nguyên vẹn (chỉ cần một mảnh vỡ của sinh vật này là đủ). Những phần bị thiếu trước khi sinh vật chết đều không được khôi phục thông qua chú tự hiệu ứng này. Sinh vật mục tiêu sẽ chịu 1 cấp độ âm thông qua chú tự hiệu ứng này, và cấp độ âm này sẽ biến mất sau 24 giờ (có thể bị loại bỏ sớm hơn bằng các phương thức khác). Sinh vật giữ lại ký ức, kỹ năng, mp, sp lúc còn sống."
    },
    "effect": {
      "Cái chạm sinh mệnh": null
    }
  },
  "effect_dimension_door": {
    "uid": "effect_dimension_door",
    "name": "Cổng thứ nguyên",
    "quality": "Thần thoại",
    "type": "Chủ động",
    "tags": ["Hệ Chú pháp", "Trí lực/Tinh thần"],
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
    "target_limit": ["Bùng nổ"],
    "is_harmless": false,
    "duration": {
      "raw": "1 hiệp/cấp"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Cổng thứ nguyên": "Tạo ra một cánh cổng, cánh cổng này kết nối vị diện mà người thi triển đang ở với các vị diện khác (hoặc chính vị diện này). Khi cánh cổng này được mở ra, sinh vật, phép thuật, hiệu ứng và vật thể của cả hai nơi đều có thể tự do đi qua cánh cổng này, cánh cổng này hiện ra dưới hình thái một cánh cổng trống rỗng lan tỏa từ trung tâm phép thuật. Người thi triển không thể dự đoán được tình hình ở phía bên kia cánh cổng, cũng không thể trực tiếp kiểm soát việc đóng cổng (trừ khi sử dụng hiệu ứng loại Giải trừ ma thuật)."
    },
    "effect": {
      "Cổng thứ nguyên": null
    }
  },
  "effect_haste_time": {
    "uid": "effect_haste_time",
    "name": "Gia tốc thời gian",
    "quality": "Sử thi",
    "type": "Bị động",
    "tags": ["Hệ Biến hóa", "Trí lực/Tinh thần"],
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
      "raw": "1 hiệp/cấp"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Nếu mục tiêu thực hiện tấn công toàn lực, kẻ đó có thể sử dụng buff tấn công cao nhất để thực hiện một đòn tấn công bổ sung thay cho hành động di chuyển bổ sung đó."
      }
    },
    "effect_desc": {
      "Thời gian gia tốc": "Mục tiêu của phép thuật chú tự mang chú tự hiệu ứng này có thể thực hiện thêm một [Hành động] mỗi hiệp. Hành động này có thể được tiến hành trước, sau hoặc xen giữa các hành động khác, nhưng không thể tiến hành trong một hành động toàn hiệp (full-round action)."
    },
    "effect": {
      "Thời gian gia tốc": null
    }
  },
  "effect_slow_time": {
    "uid": "effect_slow_time",
    "name": "Thời gian giảm tốc",
    "quality": "Sử thi",
    "type": "Bị động",
    "tags": ["Hệ Biến hóa", "Trí lực/Tinh thần"],
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
      "on_save": "Thành công thì vô hiệu"
    },
    "target_limit": ["Lựa chọn"],
    "is_harmless": false,
    "duration": {
      "raw": "1 hiệp/cấp"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Mục tiêu không thể thực hiện thêm kiểm định miễn nhiễm bổ sung nào để kết thúc hiệu ứng này. Nếu mục tiêu thất bại trong lần kiểm định miễn nhiễm đầu tiên, thì kẻ đó sẽ ở trong trạng thái choáng váng trong suốt thời gian duy trì của phép thuật chú tự."
      }
    },
    "effect_desc": {
      "Thời gian giảm tốc": "Mục tiêu ở trong trạng thái choáng váng trong suốt thời gian duy trì của chú tự hiệu ứng này, chỉ có thể thực hiện một [Tấn công] hoặc [Hành động]. Cuối mỗi hiệp có thể thực hiện một lần kiểm định miễn nhiễm mới để kết thúc hiệu ứng này."
    },
    "effect": {
      "Thời gian giảm tốc": null
    }
  },
  "effect_borrow_future": {
    "uid": "effect_borrow_future",
    "name": "Ứng trước tương lai",
    "quality": "Truyền thuyết",
    "type": "Bị động",
    "tags": ["Hệ Biến hóa", "Trí lực/Tinh thần"],
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
      "raw": "Ngay lập tức"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Mục tiêu bị choáng váng trong hiệp tiếp theo của mình, chỉ có thể thực hiện một [Tấn công] hoặc [Hành động] chứ không phải hoàn toàn không thể hành động."
      }
    },
    "effect_desc": {
      "Ứng trước tương lai": "Ngay sau khi thi triển chú tự, mục tiêu nhận được một đòn tấn công và một hành động ngay lập tức (tối đa 1 lần mỗi hiệp). Mục tiêu sẽ bị bỏ qua hiệp tiếp theo của mình, nhưng bất kỳ hiệu ứng nào phát sinh trong hiệp của kẻ đó, hoặc hiệu ứng phép thuật chuẩn bị kết thúc trong hiệp của kẻ đó đều vẫn diễn ra bình thường. Mục tiêu không ở trạng thái mất khả năng phòng vệ trong hiệp tiếp theo của mình, nhưng không thể thực hiện bất kỳ hành động nào. Nếu mục tiêu chưa hành động trong hiệp hiện tại, thì sẽ ứng trước hành động của hiệp này; nếu đã hành động, thì sẽ ứng trước hành động của hiệp tiếp theo."
    },
    "effect": {
      "Ứng trước tương lai": null
    }
  },
  "effect_manipulate_time": {
    "uid": "effect_manipulate_time",
    "name": "Thao túng thời gian",
    "quality": "Duy nhất",
    "type": "Bị động",
    "tags": ["Hệ Biến hóa", "Trí lực/Tinh thần"],
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
      "raw": "Ngay lập tức"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Thao túng thời gian": "Thời gian xung quanh mục tiêu mang chú tự hiệu ứng này đã dừng lại, điều này cho phép mục tiêu có thể thực hiện 4 [Tấn công] hoặc [Hành động] trước khi thời gian trôi chảy trở lại. Hành động bổ sung có thể được dùng để tiếp tục thi triển thao túng thời gian. Tất cả các sinh vật và vật thể khác sẽ miễn nhiễm với hành động của mục tiêu trong những hành động bổ sung này. Mục tiêu thường thi triển phép thuật lên bản thân, sử dụng vật phẩm hoặc bỏ chạy như bình thường trong khoảng thời gian này. Mục tiêu có thể chọn kết thúc sớm hiệu ứng phép thuật, khi đó có thể chọn một hiệu ứng tác động lên các mục tiêu khác làm hành động cuối cùng."
    },
    "effect": {
      "Thao túng thời gian": null
    }
  },
  "effect_negation_dispelling": {
    "uid": "effect_negation_dispelling",
    "name": "Phủ quyết",
    "quality": "Duy nhất",
    "type": "Bị động",
    "tags": ["Hệ Phòng hộ", "Trí lực/Tinh thần"],
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
      "raw": "Ngay lập tức"
    },
    "boost": {
      "total_level": 0
    },
    "effect_desc": {
      "Thao túng thời gian": "Thời gian xung quanh mục tiêu mang chú tự hiệu ứng này đã dừng lại, điều này cho phép mục tiêu có thể thực hiện 4 [Tấn công] hoặc [Hành động] trước khi thời gian trôi chảy trở lại. Hành động bổ sung có thể được dùng để tiếp tục thi triển thao túng thời gian. Tất cả các sinh vật và vật thể khác sẽ miễn nhiễm với hành động của mục tiêu trong những hành động bổ sung này. Mục tiêu thường thi triển phép thuật lên bản thân, sử dụng vật phẩm hoặc bỏ chạy như bình thường trong khoảng thời gian này. Mục tiêu có thể chọn kết thúc sớm hiệu ứng phép thuật, khi đó có thể chọn một hiệu ứng tác động lên các mục tiêu khác làm hành động cuối cùng."
    },
    "effect": {
      "Thao túng thời gian": null
    }
  },
  "effect_veil_of_meteors": {
    "uid": "effect_veil_of_meteors",
    "name": "Màn sao băng",
    "quality": "Hiếm",
    "type": "Chủ động",
    "tags": ["Hệ Tố năng", "Trí lực/Tinh thần"],
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
      "type": "Không",
      "on_save": ""
    },
    "damage": "200 mỗi sao",
    "target_limit": ["Bùng nổ"],
    "is_harmless": false,
    "duration": {
      "raw": "1 phút/cấp hoặc cho đến khi bị tiêu hao"
    },
    "overall_desc": "",
    "effect_desc": {
      "Màn sao băng": "Tạo ra 10 sao băng nhỏ xíu, lơ lửng và chuyển động trên quỹ đạo cách mục tiêu khoảng 1 mét. Sao băng sẽ tự động né tránh chướng ngại vật trên đường bay của nó, nếu tuyệt đối không thể tránh khỏi, nó sẽ đâm vào chướng ngại vật và gây sát thương vật lý. Miễn là còn bất kỳ một ngôi sao băng nào đang chuyển động, nó sẽ tạo ra một sự cản trở nhẹ, khiến bất kỳ đòn kiểm định tấn công nào nhắm vào mục tiêu đều phải nhận -3 penalty. Mỗi hiệp, mục tiêu có thể chọn cho một sao băng rơi xuống một địa điểm được chỉ định và gây sát thương, nếu nhắm vào sinh vật thì được coi là một đòn tấn công tầm xa."
    },
    "effect": {
      "Màn sao băng": null
    }
  },
  "effect_rain_of_stars": {
    "uid": "effect_rain_of_stars",
    "name": "Mưa sao sáng thế",
    "quality": "Duy nhất",
    "type": "Chủ động",
    "tags": ["Hệ Tố năng", "Trí lực/Tinh thần"],
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
      "mp": 20000,
      "sp": 0
    },
    "save_type": {
      "type": "Xem bên dưới",
      "on_save": "Thành công thì sát thương giảm một nửa"
    },
    "damage": "300 mỗi sao",
    "target_limit": ["Bùng nổ"],
    "is_harmless": false,
    "duration": {
      "raw": "7 hiệp hoặc cho đến khi bị tiêu hao"
    },
    "overall_desc": "",
    "effect_desc": {
      "Mưa sao sáng thế": "Tạo ra 5d20 sao băng nhỏ xíu, theo kết quả đổ xúc xắc tương ứng với số lượng sao màu đỏ, xanh lục, cam, xanh dương, tím. Mỗi hiệp người thi triển có thể chỉ định tất cả các ngôi sao của một màu rơi xuống, gây sát thương trực tiếp và sát thương thuộc tính, mỗi ngôi sao được tính toán riêng biệt, mục tiêu miễn nhiễm sát thương cũng sẽ miễn nhiễm sát thương thuộc tính, kiểm định miễn nhiễm thành công sẽ giảm một nửa sát thương, hiệu ứng cụ thể như sau:",
      "Đỏ": "Gây sát thương hỏa và 1d2 điểm sát thương Sức mạnh, cần kiểm định miễn nhiễm Nhanh nhẹn",
      "Xanh lục": "Gây sát thương băng và 1d2 điểm sát thương Nhanh nhẹn, cần kiểm định miễn nhiễm Thể chất",
      "Cam": "Gây sát thương axit và 1d2 điểm sát thương Thể chất, cần kiểm định miễn nhiễm Trí lực/Tinh thần",
      "Xanh dương": "Gây sát thương độc và 1d2 điểm sát thương Trí lực/Tinh thần, cần kiểm định miễn nhiễm Tinh thần",
      "Tím": "Gây sát thương điện và 1d2 điểm sát thương Tinh thần, cần kiểm định miễn nhiễm Sức mạnh"
    },
    "effect": {
      "Mưa sao sáng thế": null
    }
  },
  "effect_manipulate_gravity_hidden": {
    "uid": "effect_manipulate_gravity_hidden",
    "name": "Thao túng trọng lực",
    "quality": "Duy nhất",
    "type": "Chủ động",
    "tags": ["Hệ Biến hóa", "Trí lực/Tinh thần"],
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
      "on_save": "Thất bại sẽ bị bắt giữ"
    },
    "target_limit": ["Bùng nổ"],
    "is_harmless": false,
    "duration": {
      "raw": "1 hiệp/cấp"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Người thi triển có thể làm cho một số lượng sinh vật bằng với CL của mình không bị ảnh hưởng."
      }
    },
    "overall_desc": "Lực hấp dẫn giữa các hành tinh nằm trong tầm kiểm soát của bạn",
    "effect_desc": {
      "Trường trọng lực": "Chú tự hiệu ứng này tạo ra một trường trọng lực, mỗi hiệp bạn có thể quyết định hướng và hệ số của trọng lực (trong phạm vi từ 0-100). Tất cả các sinh vật và vật thể không được cố định trong trường trọng lực đều bị lực hấp dẫn bắt giữ, những sinh vật được cố định hoặc có khả năng bay phải thực hiện kiểm định Sức mạnh dc={25 + hệ số trọng lực}, nếu thất bại cũng sẽ bị bắt giữ, kéo dài cho đến khi ra tới rìa. Nếu rìa không có vật cản, chúng sẽ lơ lửng dao động ở rìa, nếu có vật cản khiến chúng không thể chạm tới rìa, thì các sinh vật này sẽ va đập vào vật cản và chịu sát thương do rơi xuống (công thức tính sát thương: hệ số trọng lực x {100 điểm sát thương mỗi 3 mét, tối đa 8000 điểm}). Miễn là phép thuật chú tự chứa chú tự hiệu ứng này còn hiệu lực, bất kỳ vật thể nào cố gắng tiến vào khu vực này đều sẽ ngay lập tức bị ảnh hưởng bởi hiệu ứng trọng lực. Những sinh vật ở trong khu vực này mỗi hiệp phải thực hiện một lần kiểm định miễn nhiễm Thể chất dc=10+hệ số trọng lực, nếu thất bại cơ thể sẽ bị xé rách bởi trọng lực, chịu sát thương lực trường bằng {hệ số trọng lực/2}% HP tối đa. Các đòn tấn công tầm xa đi qua khu vực này sẽ tự động trượt mục tiêu. Người thi triển miễn nhiễm với hiệu ứng này và có thể tự do ra vào khu vực.",
      "Môi trường trọng lực cao": "Dưới mức trọng lực lớn hơn 10 lần, hành động sẽ bị ảnh hưởng nghiêm trọng. Mỗi lần mục tiêu bị ảnh hưởng tiêu hao [Tấn công] hoặc [Hành động] trong khu vực, chúng phải thực hiện một lần kiểm định miễn nhiễm Thể chất dc=10+hệ số trọng lực, nếu thất bại sẽ tự động trượt mục tiêu do tác động của trọng lực và chịu sát thương lực trường bằng {hệ số trọng lực/2}% HP tối đa. Nếu kiểm định thành công thì hành động sẽ bị trừ đi {hệ số trọng lực/2} điểm, và sát thương lực trường phải chịu sẽ giảm đi một nửa. Các đòn tấn công tầm xa đi qua khu vực này sẽ tự động trượt mục tiêu."
    },
    "effect": {
      "Trường trọng lực": null
    }
  },
  "effect_supernova_hidden": {
    "uid": "effect_supernova_hidden",
    "name": "Siêu tân tinh",
    "quality": "Duy nhất",
    "type": "Chủ động",
    "tags": ["Hệ Biến hóa", "Trí lực/Tinh thần"],
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
      "type": "Thể chất hoặc Ý chí, xem bên dưới",
      "on_save": "Không"
    },
    "target_limit": ["Bùng nổ"],
    "is_harmless": false,
    "duration": {
      "raw": "1 phút/cấp"
    },
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Người thi triển làm cho một số lượng sinh vật bằng với CL của mình không bị ảnh hưởng, và tăng thời gian duy trì lên 10 phút/cấp. Tiêu hao 20000mp.",
        "extra_cost": {
          "mp": 20000,
          "hp": 0,
          "sp": 0
        }
      }
    },
    "overall_desc": "Siêu tân tinh! Bạn đã nắm giữ chân lý của sự hủy diệt",
    "effect_desc": {
      "Siêu tân tinh": "Mô phỏng vụ nổ siêu tân tinh tại một địa điểm chỉ định. Gây sát thương bằng 80% HP, MP, SP tối đa lên mục tiêu, nếu kiểm định miễn nhiễm Thể chất thành công có thể làm giảm sát thương xuống còn 60% mức tối đa. Khu vực có bức xạ, hạt và chấn động năng lượng cao, ngoại trừ những vật phẩm bạn tự mang theo hoặc tiếp xúc, tất cả các hiệu ứng phép thuật và vật phẩm ma thuật khác sẽ bị phân giải, hiệu ứng phép thuật / giống phép thuật / siêu nhiên sẽ bị phá hủy hoàn toàn, hiệu lực chấm dứt ngay lập tức, trong khi các vật phẩm ma thuật vĩnh viễn phải thực hiện kiểm định miễn nhiễm tinh thần (nếu đang được ai đó cầm thì lấy chỉ số tinh thần của người đó), nếu thất bại thì sẽ bị hoàn nguyên thành vật phẩm thông thường trong suốt thời gian hiệu lực. Nếu kiểm định miễn nhiễm của vật phẩm đổ ra điểm 1, nó sẽ bị phá hủy vĩnh viễn thay vì bị áp chế. Xung kích sẽ làm rung chuyển cấu trúc không thời gian, tất cả các hiệu ứng liên quan đến thời gian / không gian sẽ tạo ra những hậu quả không thể lường trước trong thời gian hiệu lực."
    },
    "effect": {
      "Siêu tân tinh": null
    }
  },
}