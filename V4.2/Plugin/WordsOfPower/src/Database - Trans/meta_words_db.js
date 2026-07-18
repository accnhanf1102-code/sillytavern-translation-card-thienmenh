export const META_WORDS_DB = 
{
  "meta_boost": {
    "uid": "meta_boost",
    "name": "Tăng cường",
    "quality_limit": "Phổ thông",
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
      "Tăng cường": "Chú tự siêu ma này làm cho một hiệu ứng hoặc chú tự mục tiêu kích hoạt hiệu ứng tăng cường của nó. Nếu một chú tự có nhiều lựa chọn tăng cường, người thi triển có thể chọn dùng cái nào (nhưng không thể chọn nhiều hơn một). Siêu ma này chỉ có thể áp dụng một lần cho mỗi chú tự, nhưng có thể áp dụng riêng biệt cho nhiều chú tự trong cùng một phép thuật tổ hợp"
    },
    "effect": null
  },
  "meta_enlarge": {
    "uid": "meta_enlarge",
    "name": "Tăng xa",
    "quality_limit": "Phổ thông",
    "mod_target": [
      "Mục tiêu"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "Tăng xa": "Chú tự siêu ma này tăng khoảng cách của phép thuật chú tự, tùy thuộc vào chú tự mục tiêu của nó. Cự ly gần thành cự ly trung bình (100 feet + 10 feet/CL), cự ly trung bình thành cự ly xa (400 feet + 40 feet/CL). Chú tự này không có hiệu ứng đối với các chú tự mục tiêu nằm ngoài cự ly gần và cự ly trung bình."
    },
    "effect": null
  },
  "meta_tenacious": {
    "uid": "meta_tenacious",
    "name": "Ngoan cường",
    "quality_limit": "Hiếm",
    "mod_target": [
      "Phép thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 2000,
      "sp": 0
    },
    "effect_desc": {
      "Ngoan cường": "Mục tiêu của phép thuật chú tự mang chú tự siêu ma này phải thực hiện hai lần kiểm định miễn nhiễm và lấy kết quả tệ hơn"
    },
    "effect": null
  },
  "meta_extend": {
    "uid": "meta_extend",
    "name": "Kéo dài",
    "quality_limit": "Phổ thông",
    "mod_target": [
      "Hiệu ứng"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 2000,
      "sp": 0
    },
    "effect_desc": {
      "Kéo dài": "Thời gian duy trì của phép thuật chú tự mang chú tự siêu ma này được nhân đôi. Không có tác dụng với các chú tự hiệu ứng có thời gian duy trì là “ngay lập tức”. Hiệu ứng của chú tự siêu ma này sẽ không cộng dồn với chuyên môn “Kéo dài phép thuật”."
    },
    "effect": null
  },

  "meta_delay": {
    "uid": "meta_delay",
    "name": "Trì hoãn",
    "quality_limit": "Hiếm",
    "mod_target": [
      "Hiệu ứng",
      "Phép thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "effect_desc": {
      "Trì hoãn": "Chú tự hiệu ứng mang chú tự siêu ma này khi phóng ra có thể thiết lập trì hoãn tối đa 10 hiệp mới phát huy tác dụng. Trong khoảng thời gian này bạn có thể quyết định hủy bỏ trì hoãn để phép thuật có hiệu lực ngay lập tức. Nhưng không được tiếp tục trì hoãn. Sau khi kết thúc trì hoãn, phép thuật sẽ có hiệu lực tại vị trí bạn chỉ định ban đầu (không được thay đổi trong thời gian trì hoãn). Khi áp dụng siêu ma này cho một chú tự hiệu ứng, sẽ chặn sự phát huy tác dụng của tất cả các hiệu ứng sau chú tự hiệu ứng đó, nhưng không ảnh hưởng đến những hiệu ứng trước đó. Nếu áp dụng cho phép thuật thì sẽ tạm dừng sự phát huy tác dụng của toàn bộ phép thuật"
    },
    "effect": null
  },
  "meta_inerting": {
    "uid": "meta_inerting",
    "name": "Trơ hóa",
    "quality_limit": "Ưu Tú",
    "mod_target": [
      "Hiệu ứng"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 1000,
      "sp": 0
    },
    "effect_desc": {
      "Trơ hóa": "Siêu ma này kéo dài thời gian phát huy tác dụng của chú tự hiệu ứng có tác dụng ngay lập tức thành n hiệp (không quá 20). Không có tác dụng đối với các chú tự có thời gian duy trì. Điều này sẽ làm cho các chỉ số của hiệu ứng sát thương và trị liệu trong hiệu ứng giảm xuống còn 1/n, các hiệu ứng chỉ số khác hoặc hiệu ứng không phải chỉ số chuyển thành kích hoạt theo xác suất, điều kiện kích hoạt 1d20>n"
    },
    "effect": null
  },
  "meta_selective": {
    "uid": "meta_selective",
    "name": "Chọn lọc",
    "quality_limit": "Ưu Tú",
    "mod_target": [
      "Phép thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 4000,
      "sp": 0
    },
    "effect_desc": {
      "Chọn lọc": "Khi thi triển phép có thể chọn tối đa {Thuộc tính chính thi triển/4} sinh vật miễn nhiễm khỏi tác động của hiệu ứng phép thuật tổ hợp, chỉ có hiệu lực đối với hiệu ứng sát thương hoặc trị liệu phạm vi có tác dụng ngay lập tức, không có hiệu lực đối với hiệu ứng chỉ định, hiệu ứng duy trì, hiệu ứng môi trường, trường phản ma thuật, thuật phân giải, giải trừ ma thuật v.v."
    },
    "effect": null
  },
  "meta_solid": {
    "uid": "meta_solid",
    "name": "Thực hình",
    "quality_limit": "Hiếm",
    "mod_target": [
      "Phép thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "Thực hình": "Chú tự siêu ma này thay đổi loại kiểm định miễn nhiễm cuối cùng mà chú tự sử dụng. Nếu cần kiểm định tinh thần, sẽ đổi thành kiểm định thể chất. Sự thay đổi này không ảnh hưởng đến việc kiểm định miễn nhiễm thành công của mỗi chú tự hiệu ứng cụ thể có bỏ qua, giảm bớt hiệu ứng của nó, hoặc chịu các hiệu ứng khác hay không"
    },
    "effect": null
  },
  "meta_ethereal": {
    "uid": "meta_ethereal",
    "name": "Hư hình",
    "quality_limit": "Hiếm",
    "mod_target": [
      "Phép thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 3000,
      "sp": 0
    },
    "effect_desc": {
      "Hư hình": "Chú tự siêu ma này thay đổi loại kiểm định miễn nhiễm cuối cùng mà chú tự sử dụng. Nếu cần kiểm định thể chất, sẽ đổi thành kiểm định tinh thần. Sự thay đổi này không ảnh hưởng đến việc kiểm định miễn nhiễm thành công của mỗi chú tự hiệu ứng cụ thể có bỏ qua, giảm bớt hiệu ứng của nó, hoặc chịu các hiệu ứng khác hay không."
    },
    "effect": null
  },
  "meta_piercing": {
    "uid": "meta_piercing",
    "name": "Xuyên thấu",
    "quality_limit": "Truyền thuyết",
    "mod_target": [
      "Phép thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 10000,
      "sp": 0
    },
    "effect_desc": {
      "Xuyên thấu": "Siêu ma này khiến tất cả các hiệu ứng trong phép thuật tổ hợp có thể xuyên thấu sự miễn dịch và giảm trừ do các kỹ năng từ cùng cấp trở xuống mang lại"
    },
    "effect": null
  },
  "meta_silent": {
    "uid": "meta_silent",
    "name": "Im lặng",
    "quality_limit": "Phổ thông",
    "mod_target": [
      "Hiệu ứng"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 1000,
      "sp": 0
    },
    "effect_desc": {
      "Im lặng": "Phép thuật chú tự mang chú tự siêu ma này không cần thành phần ngôn ngữ. Chú tự siêu ma này có thể ảnh hưởng đến một chú tự hiệu ứng."
    },
    "effect": null
  },
  "meta_simple": {
    "uid": "meta_simple",
    "name": "Đơn giản",
    "quality_limit": "Phổ thông",
    "mod_target": [
      "Hiệu ứng"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 1000,
      "sp": 0
    },
    "effect_desc": {
      "Đơn giản": "Phép thuật chú tự mang chú tự siêu ma này không cần thành phần vật liệu. Chú tự siêu ma này có thể ảnh hưởng đến một chú tự hiệu ứng."
    },
    "effect": null
  },
  "meta_infinite": {
    "uid": "meta_infinite",
    "name": "Vô hạn",
    "quality_limit": "Truyền thuyết",
    "mod_target": [
      "Phép thuật"
    ],
    "extra_cost": {
      "hp": 0,
      "mp": 10000,
      "sp": 0
    },
    "effect_desc": {
      "Vô hạn": "Khiến cấu tạo của chú tự tổ hợp không bị giới hạn bởi số lượng chú tự và giới hạn MP tối đa. Tương ứng, phần vượt quá giới hạn tiêu hao sẽ tiêu hao lượng HP tương đương"
    },
    "effect": null
  }
}