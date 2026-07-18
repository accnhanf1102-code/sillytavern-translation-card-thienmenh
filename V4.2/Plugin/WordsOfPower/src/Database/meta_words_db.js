export const META_WORDS_DB = 
{
  "meta_boost": {
    "uid": "meta_boost",
    "name": "Tăng cường",
    "quality_limit": "Common",
    "mod_target": [
      "Mục tiêu",
      "Hiệu ứng"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "Tăng cường": "Siêu ma chú tự này kích hoạt hiệu ứng tăng cường của một chú tự mục tiêu hoặc chú tự hiệu ứng. Nếu một chú tự có nhiều lựa chọn tăng cường, người thi triển có thể chọn một trong số đó (nhưng không được chọn nhiều hơn một). Mỗi chú tự chỉ có thể áp dụng siêu ma này một lần, nhưng có thể áp dụng riêng biệt cho nhiều chú tự trong cùng một tổ hợp pháp thuật."
    },
    "effect": null
  },
  "meta_enlarge": {
    "uid": "meta_enlarge",
    "name": "Tăng tầm",
    "quality_limit": "Common",
    "mod_target": [
      "Mục tiêu"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "Tăng tầm": "Siêu ma chú tự này làm tăng khoảng cách của pháp thuật chú tự, tùy thuộc vào chú tự mục tiêu của nó. Tầm gần trở thành tầm trung (100 feet + 10 feet/CL), tầm trung trở thành tầm xa (400 feet + 40 feet/CL). Chú tự này không có hiệu lực với các chú tự mục tiêu không thuộc tầm gần hoặc tầm trung."
    },
    "effect": null
  },
  "meta_tenacious": {
    "uid": "meta_tenacious",
    "name": "Kiên cường",
    "quality_limit": "Rare",
    "mod_target": [
      "Pháp thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 2000,
      "sp": 0
    },
    "effect_desc": {
      "Kiên cường": "Mục tiêu của pháp thuật chú tự chứa siêu ma này phải thực hiện hai lần kiểm định cứu nguy và lấy kết quả kém hơn."
    },
    "effect": null
  },
  "meta_extend": {
    "uid": "meta_extend",
    "name": "Kéo dài",
    "quality_limit": "Common",
    "mod_target": [
      "Hiệu ứng"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 2000,
      "sp": 0
    },
    "effect_desc": {
      "Kéo dài": "Thời gian duy trì của pháp thuật chú tự chứa siêu ma này được nhân đôi. Không có hiệu lực đối với các chú tự hiệu ứng có thời gian duy trì là \"Tức thì\". Hiệu ứng của siêu ma này không cộng dồn với thiên phú \"Kéo dài phép thuật\" (Extend Spell)."
    },
    "effect": null
  },
  "meta_delay": {
    "uid": "meta_delay",
    "name": "Trì hoãn",
    "quality_limit": "Rare",
    "mod_target": [
      "Hiệu ứng",
      "Pháp thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "effect_desc": {
      "Trì hoãn": "Chú tự hiệu ứng chứa siêu ma này có thể được thiết lập để trì hoãn kích hoạt tối đa 10 vòng. Trong thời gian này, bạn có thể quyết định hủy trì hoãn để pháp thuật có hiệu lực ngay lập tức, nhưng không được tiếp tục trì hoãn. Sau khi kết thúc trì hoãn, pháp thuật sẽ có hiệu lực tại vị trí bạn đã chỉ định ban đầu (không được thay đổi trong thời gian trì hoãn). Khi áp dụng siêu ma này cho một chú tự hiệu ứng, nó sẽ chặn hiệu lực của tất cả các chú tự sau đó, nhưng không ảnh hưởng đến các chú tự trước đó. Khi áp dụng cho toàn bộ pháp thuật, nó sẽ tạm dừng hiệu lực của toàn bộ pháp thuật."
    },
    "effect": null
  },
  "meta_inerting": {
    "uid": "meta_inerting",
    "name": "Trơ hóa",
    "quality_limit": "Uncommon",
    "mod_target": [
      "Hiệu ứng"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 1000,
      "sp": 0
    },
    "effect_desc": {
      "Trơ hóa": "Siêu ma này kéo dài thời gian có hiệu lực của chú tự hiệu ứng \"Tức thì\" thành n vòng (không quá 20). Không có hiệu lực với các chú tự có thời gian duy trì. Điều này khiến giá trị của các hiệu ứng sát thương và trị liệu trong chú tự thay đổi thành 1/n, các hiệu ứng giá trị khác hoặc hiệu ứng phi giá trị sẽ chuyển sang cơ chế kích hoạt xác suất với điều kiện: 1d20 > n."
    },
    "effect": null
  },
  "meta_selective": {
    "uid": "meta_selective",
    "name": "Tuyển chọn",
    "quality_limit": "Uncommon",
    "mod_target": [
      "Pháp thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "effect_desc": {
      "Tuyển chọn": "Khi thi triển, chọn số lượng sinh vật tối đa là {Thuộc tính chính của pháp thuật/4} để miễn nhiễm với hiệu ứng của tổ hợp pháp thuật. Chỉ áp dụng cho các hiệu ứng sát thương hoặc trị liệu phạm vi có hiệu lực tức thì; không có hiệu lực với các hiệu ứng nhắm mục tiêu, hiệu ứng duy trì, hiệu ứng môi trường, khu vực phản ma pháp, phân rã, giải trừ ma pháp, v.v."
    },
    "effect": null
  },
  "meta_solid": {
    "uid": "meta_solid",
    "name": "Thực thể",
    "quality_limit": "Rare",
    "mod_target": [
      "Pháp thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "Thực thể": "Siêu ma chú tự này thay đổi loại kiểm định cứu nguy cuối cùng mà chú tự sử dụng. Nếu yêu cầu kiểm định Tinh thần, sẽ đổi thành kiểm định Thể chất. Sự thay đổi này không ảnh hưởng đến việc liệu kiểm định cứu nguy thành công có thể bỏ qua hoặc giảm nhẹ hiệu ứng của từng chú tự hiệu ứng cụ thể hay không."
    },
    "effect": null
  },
  "meta_ethereal": {
    "uid": "meta_ethereal",
    "name": "Hư thể",
    "quality_limit": "Rare",
    "mod_target": [
      "Pháp thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "Hư thể": "Siêu ma chú tự này thay đổi loại kiểm định cứu nguy cuối cùng mà chú tự sử dụng. Nếu yêu cầu kiểm định Thể chất, sẽ đổi thành kiểm định Tinh thần. Sự thay đổi này không ảnh hưởng đến việc liệu kiểm định cứu nguy thành công có thể bỏ qua hoặc giảm nhẹ hiệu ứng của từng chú tự hiệu ứng cụ thể hay không."
    },
    "effect": null
  },
  "meta_piercing": {
    "uid": "meta_piercing",
    "name": "Xuyên thấu",
    "quality_limit": "Legendary",
    "mod_target": [
      "Pháp thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 10000,
      "sp": 0
    },
    "effect_desc": {
      "Xuyên thấu": "Siêu ma này khiến tất cả các hiệu ứng trong tổ hợp pháp thuật có thể xuyên thấu các miễn nhiễm và giảm sát thương đến từ các kỹ năng có cấp độ tương đương trở xuống."
    },
    "effect": null
  },
  "meta_silent": {
    "uid": "meta_silent",
    "name": "Im lặng",
    "quality_limit": "Common",
    "mod_target": [
      "Hiệu ứng"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 1000,
      "sp": 0
    },
    "effect_desc": {
      "Im lặng": "Pháp thuật chú tự chứa siêu ma này không cần thành phần ngôn ngữ. Siêu ma chú tự này có thể ảnh hưởng đến một chú tự hiệu ứng."
    },
    "effect": null
  },
  "meta_simple": {
    "uid": "meta_simple",
    "name": "Đơn giản",
    "quality_limit": "Common",
    "mod_target": [
      "Hiệu ứng"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 1000,
      "sp": 0
    },
    "effect_desc": {
      "Đơn giản": "Pháp thuật chú tự chứa siêu ma này không cần thành phần vật chất. Siêu ma chú tự này có thể ảnh hưởng đến một chú tự hiệu ứng."
    },
    "effect": null
  },
  "meta_infinite": {
    "uid": "meta_infinite",
    "name": "Vô hạn",
    "quality_limit": "Legendary",
    "mod_target": [
      "Pháp thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 10000,
      "sp": 0
    },
    "effect_desc": {
      "Vô hạn": "Khiến việc cấu thành tổ hợp chú tự không bị giới hạn bởi số lượng chú tự và giới hạn tối đa MP. Tương ứng, phần vượt quá giới hạn tiêu hao sẽ tiêu hao lượng HP tương đương."
    },
    "effect": null
  }
}