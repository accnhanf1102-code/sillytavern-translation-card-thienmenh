export const TARGET_WORDS_DB = 
{
  "target_personal": {
    "uid": "target_personal",
    "name": "Cá nhân",
    "quality_limit": "Common",
    "range_desc": null,
    "target_desc": "Phép thuật chứa chú tự mục tiêu này chỉ ảnh hưởng đến người thi triển.",
    "boost": {
      "total_level": 0
    }
  },
  "target_select": {
    "uid": "target_select",
    "name": "Lựa chọn",
    "quality_limit": "Common",
    "range_desc": "Cận chiến (9m + 2m/2CL)",
    "target_desc": "Ảnh hưởng đến một mục tiêu đơn lẻ trong phạm vi. Nếu phép thuật chú tự gây sát thương năng lượng, chú tự này tạo ra một tia tấn công chạm tầm xa.",
    "boost": {
      "total_level": 1,
      "1": {
        "rep_target_desc": "Chú tự ảnh hưởng tối đa 1 mục tiêu mỗi CL, và khoảng cách giữa hai mục tiêu không quá 9m. Khoảng cách tăng lên tầm trung (30m + 3m/CL). Nếu phép thuật chú tự gây sát thương năng lượng, người thi triển phải thực hiện tấn công tia riêng biệt cho mỗi mục tiêu. Chú tự mục tiêu cường hóa này tăng tiêu hao pháp thuật thêm 3000 MP.",
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
    "name": "Đi theo",
    "quality_limit": "Uncommon",
    "range_desc": "Cận chiến (9m + 2m/2CL)",
    "target_desc": "Ảnh hưởng đến tất cả mục tiêu trong bán kính 3m quanh mục tiêu được chọn (người thi triển có thể chọn mục tiêu trung tâm có bị ảnh hưởng hay không), hiệu ứng phép thuật di chuyển theo sự di chuyển của mục tiêu được chọn. Chỉ những chú tự hiệu ứng có thời gian duy trì mới di chuyển theo, không có thời gian duy trì thì hiệu ứng có tác dụng ngay lập tức. Người thi triển đi vào phạm vi cũng sẽ bị ảnh hưởng.",
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Bán kính ảnh hưởng mở rộng thành 9m, có thể chọn số mục tiêu tương đương CL của bạn không bị ảnh hưởng."
      }
    }
  },
  "target_item_enchant": {
    "uid": "target_item_enchant",
    "name": "Chú năng",
    "quality_limit": "Uncommon",
    "range_desc": "Tiếp xúc",
    "target_desc": "Chú tự mục tiêu này có thể ảnh hưởng đến một vật phẩm khi tiếp xúc. Lưu trữ phép thuật tạm thời trong vật phẩm, sau đó có thể giải phóng trong bất kỳ quá trình tấn công nào. Chú năng có thể duy trì trong 10 vòng hoặc cho đến khi bị tiêu hao. Trúng đích thành công sẽ giải phóng phép thuật và tiêu hao chú năng, trượt thì có thể giữ năng lượng để thử lại.",
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Khoảng cách tăng lên tầm trung (30m + 3m/CL). Bạn có thể chú năng vào vật phẩm trong tay các sinh vật tự nguyện khác.",
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
    "name": "Tường",
    "quality_limit": "Rare",
    "range_desc": "Cận chiến (9m + 2m/2CL)",
    "target_desc": "Chú tự mục tiêu này tạo ra một bức tường có thể nhìn thấy, dài 3m và cao 3m mỗi CL. Sinh vật chạm hoặc xuyên qua tường bị ảnh hưởng bởi hiệu ứng phép thuật. Tường không cản sinh vật xuyên qua. Sinh vật chiếm đóng khu vực mục tiêu khi phép thuật được thi triển sẽ bị ảnh hưởng bởi hiệu ứng phép thuật. Tường dày 1 thước, phải kết nối với bề mặt vững chắc và phải thẳng khi tạo ra.",
    "boost": {
      "total_level": 1,
      "1": {
        "rep_target_desc": "Tường trở thành dài 6m và rộng 6m mỗi CL. Tường có thể được tạo hình thành bất kỳ hình dạng nào, nhưng vẫn phải duy trì bề mặt thẳng đứng.",
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
    "name": "Bộc phát",
    "quality_limit": "Uncommon",
    "range_desc": "Cận chiến (9m + 2m/2CL)",
    "target_desc": "Chú tự mục tiêu này ảnh hưởng đến tất cả mục tiêu trong bán kính 3m. Nếu chọn chú tự hiệu ứng bộc phát sẽ tạo ra vật tán xạ hoặc hiệu ứng lưu lại, chiếm cùng một khu vực bộc phát, duy trì tác dụng trong phạm vi trong thời gian hiệu lực và không thể di chuyển sau khi tạo ra.",
    "boost": {
      "total_level": 3,
      "1": {
        "rep_target_desc": "Phép thuật ảnh hưởng đến khu vực bộc phát bán kính 6m. Khoảng cách tăng lên tầm trung (30m + 3m/CL). Cường hóa chú tự này làm tăng tiêu hao thêm 3000 MP.",
        "extra_cost": {
          "mp": 3000,
          "hp": 0,
          "sp": 0
        }
      },
      "2": {
        "rep_target_desc": "Phép thuật ảnh hưởng đến khu vực bộc phát bán kính 12m. Khoảng cách tăng lên tầm xa (120m + 12m/CL). Cường hóa chú tự này làm tăng tiêu hao thêm 6000 MP.",
        "extra_cost": {
          "mp": 6000,
          "hp": 0,
          "sp": 0
        }
      },
      "limit": {
        "add_desc": "(Tùy chọn trên cấp 4) Phạm vi ảnh hưởng không giới hạn. Khoảng cách thi triển không giới hạn. Tiêu hao thêm 50% MP tối đa.",
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
    "name": "Tạo hình",
    "quality_limit": "Common",
    "range_desc": "Khối lập phương có cạnh tối đa 6m",
    "target_desc": "Chọn một hình học đơn giản làm phạm vi mục tiêu (không được vượt quá thể tích tối đa). Chú tự mục tiêu này ảnh hưởng đến các sinh vật trong phạm vi. Không giống như bộc phát, thông thường không để lại hiệu ứng dư thừa trong phạm vi.",
    "boost": {
      "total_level": 3,
      "1": {
        "rep_range_desc": "Cạnh tăng lên 12m. Tiêu hao tăng thêm 3000 MP.",
        "extra_cost": {
          "mp": 3000,
          "hp": 0,
          "sp": 0
        }
      },
      "2": {
        "rep_range_desc": "Cạnh tăng lên 24m. Tiêu hao tăng thêm 6000 MP.",
        "extra_cost": {
          "mp": 6000,
          "hp": 0,
          "sp": 0
        }
      },
      "limit": {
        "add_desc": "(Tùy chọn trên cấp 4) Cạnh tăng lên không giới hạn. Tiêu hao tăng thêm 50% MP tối đa.",
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
    "name": "Tự do",
    "quality_limit": "Epic",
    "range_desc": "Tùy chỉnh",
    "target_desc": "Sự hiểu biết của bạn về chú tự không ai sánh bằng, bạn có thể tự định nghĩa phạm vi mục tiêu cũng như hình thái phép thuật.",
    "boost": {
      "total_level": 0
    }
  },
  "target_curtain_of_stars_hidden": {
    "uid": "target_curtain_of_stars_hidden",
    "name": "Màn trướng tinh tú",
    "quality_limit": "Epic",
    "range_desc": "Tầm xa (120m + 12m/CL)",
    "target_desc": "Trong phạm vi, khu vực được xác định có chu vi không quá 24m mỗi CL bị che khuất bởi màn trướng tinh tú vô hình, và tạo ra 5 ngôi sao chứa đựng phép thuật tổ hợp hoàn chỉnh (chú tự mục tiêu được coi là 'Lựa chọn'). Hoàn toàn vô hình về mặt thị giác (có thể bị phát hiện bởi hiệu ứng nhìn thấu tàng hình, và có hào quang ma thuật trung bình. Nếu trong đêm tối, không thể bị nhìn thấu, chỉ có hào quang ma thuật mờ nhạt). Bất kỳ sinh vật nào đi vào màn trướng sẽ bị ảnh hưởng bởi hiệu ứng giống như Phép Mê Cung, mỗi vòng có thể thực hiện kiểm định Trí tuệ DC=30 để cố gắng thoát ra. Nếu kiểm định thất bại, sẽ tiêu hao một ngôi sao và bị ngôi sao tấn công. Khi không có sinh vật nào đi vào, màn trướng có thể duy trì vô thời hạn, thời gian bắt đầu đếm ngược sau khi sinh vật đầu tiên đi vào, tự nhiên biến mất sau 10 phút hoặc sau khi tất cả các ngôi sao bị tiêu hao, bạn có thể giải trừ nó bất cứ lúc nào.",
    "boost": {
      "total_level": 0
    }
  }
}