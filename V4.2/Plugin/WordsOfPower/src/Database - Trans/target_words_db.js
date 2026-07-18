export const TARGET_WORDS_DB = 
{
  "target_personal": {
    "uid": "target_personal",
    "name": "Bản Thân",
    "quality_limit": "Phổ thông",
    "range_desc": null,
    "target_desc": "Phép thuật chứa chú tự mục tiêu này chỉ ảnh hưởng đến người thi triển",
    "boost": {
      "total_level": 0
    }
  },
  "target_select": {
    "uid": "target_select",
    "name": "Chọn Mục Tiêu",
    "quality_limit": "Phổ thông",
    "range_desc": "Cự ly gần (9 mét + 2 mét/2CL)",
    "target_desc": "Ảnh hưởng đến một mục tiêu đơn lẻ trong phạm vi, nếu phép thuật chú tự gây sát thương năng lượng, chú tự này sẽ tạo ra một tia sáng yêu cầu tấn công tiếp xúc tầm xa",
    "boost": {
      "total_level": 1,
      "1": {
        "rep_target_desc": "Chú tự ảnh hưởng tối đa 1 mục tiêu mỗi CL, và khoảng cách giữa hai mục tiêu không được vượt quá 9 mét. Khoảng cách tăng lên thành cự ly trung bình (30 mét + 3 mét/CL). Nếu phép thuật chú tự gây sát thương năng lượng, người thi triển phải thực hiện tấn công bằng tia sáng riêng biệt cho mỗi mục tiêu. Việc tăng cường chú tự mục tiêu này sẽ làm tăng tiêu hao của phép thuật thêm 3000 mp",
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
    "name": "Truy Đuổi",
    "quality_limit": "Ưu lương",
    "range_desc": "Cự ly gần (9 mét + 2 mét/2CL)",
    "target_desc": "Ảnh hưởng đến toàn bộ mục tiêu trong bán kính 3 mét lấy mục tiêu đã chọn làm trung tâm (người thi triển có thể chọn mục tiêu trung tâm có bị ảnh hưởng hay không), hiệu ứng phép thuật di chuyển theo sự di chuyển của mục tiêu đã chọn. Chỉ những chú tự hiệu ứng có thời gian duy trì mới di chuyển theo, hiệu ứng không có thời gian duy trì sẽ có tác dụng ngay lập tức. Người thi triển khi tiến vào phạm vi cũng sẽ bị ảnh hưởng tương tự",
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Bán kính ảnh hưởng mở rộng thành 9 mét, có thể chọn mục tiêu bằng với CL của bạn để không bị ảnh hưởng"
      }
    }
  },
    "target_item_enchant": {
    "uid": "target_item_enchant",
    "name": "Truyền năng lượng",
    "quality_limit": "Ưu lương",
    "range_desc": "Tiếp xúc",
    "target_desc": "Chú tự mục tiêu này có thể ảnh hưởng đến một vật phẩm được tiếp xúc. Tạm thời lưu trữ phép thuật trong vật phẩm, sau đó có thể giải phóng trong bất kỳ quá trình tấn công nào. Truyền năng lượng có thể duy trì trong 10 hiệp hoặc cho đến khi bị tiêu hao. Đòn đánh trúng thành công sẽ giải phóng phép thuật và tiêu hao năng lượng đã truyền, đánh trượt thì có thể giữ lại năng lượng để tiếp tục thử lại",
    "boost": {
      "total_level": 1,
      "1": {
        "add_desc": "Khoảng cách tăng lên thành cự ly trung bình (30 mét + 3 mét/CL). Bạn có thể truyền năng lượng cho vật phẩm trong tay của các sinh vật tự nguyện khác",
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
    "quality_limit": "Hiếm có",
    "range_desc": "Cự ly gần (9 mét + 2 mét/2CL)",
    "target_desc": "Chú tự mục tiêu này tạo ra một bức tường có thể nhìn thấy, chiều dài 3 mét và chiều cao 3 mét mỗi CL. Sinh vật tiếp xúc hoặc đi qua bức tường sẽ bị ảnh hưởng bởi hiệu ứng phép thuật. Bức tường không ngăn cản sinh vật đi qua. Sinh vật đang chiếm giữ khu vực mục tiêu khi thi triển phép thuật sẽ bị ảnh hưởng bởi hiệu ứng phép thuật. Bức tường rộng 1 thước, phải được kết nối với một bề mặt vững chắc, và phải thẳng khi được tạo ra",
    "boost": {
      "total_level": 1,
      "1": {
        "rep_target_desc": "Bức tường trở thành dài 6 mét, rộng 6 mét mỗi CL. Bức tường có thể được tạo hình thành bất kỳ hình dạng nào, nhưng vẫn phải duy trì bề mặt thẳng đứng",
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
    "name": "Bùng nổ",
    "quality_limit": "Ưu lương",
    "range_desc": "Cự ly gần (9 mét + 2 mét/2CL)",
    "target_desc": "Chú tự mục tiêu này ảnh hưởng đến tất cả các mục tiêu trong bán kính 3 mét. Nếu chọn chú tự hiệu ứng bùng nổ, nó sẽ tạo ra vật chất phát tán hoặc hiệu ứng tàn lưu, chiếm cùng một khu vực bùng nổ, và duy trì hiệu lực trong phạm vi trong suốt thời gian duy trì, đồng thời không thể di chuyển sau khi được tạo ra",
    "boost": {
      "total_level": 3,
      "1": {
        "rep_target_desc": "Phép thuật ảnh hưởng đến tất cả khu vực bùng nổ trong bán kính 6 mét. Khoảng cách tăng lên thành cự ly trung bình (30 mét + 3 mét/CL). Tăng cường chú tự này sẽ làm tăng tiêu hao thêm 3000 mp",
        "extra_cost": {
          "mp": 3000,
          "hp": 0,
          "sp": 0
        }
      },
      "2": {
        "rep_target_desc": "Phép thuật ảnh hưởng đến tất cả khu vực bùng nổ trong bán kính 12 mét. Khoảng cách tăng lên thành cự ly xa (120 mét + 12 mét/CL). Tăng cường chú tự này sẽ làm tăng tiêu hao của nó thêm 6000 mp",
        "extra_cost": {
          "mp": 6000,
          "hp": 0,
          "sp": 0
        }
      },
      "limit": {
        "add_desc": "(Có thể chọn từ cấp bậc 4 trở lên) Phạm vi ảnh hưởng không giới hạn. Khoảng cách thi triển phép không giới hạn. Tiêu hao thêm 50% mp tối đa",
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
    "quality_limit": "Phổ thông",
    "range_desc": "Khối lập phương có độ dài cạnh tối đa là 6 mét",
    "target_desc": "Chọn một hình học không gian đơn giản làm phạm vi mục tiêu (không được vượt quá thể tích tối đa). Chú tự mục tiêu này ảnh hưởng đến sinh vật trong phạm vi. Không giống như bùng nổ, thường sẽ không có hiệu ứng tàn lưu trong phạm vi",
    "boost": {
      "total_level": 3,
      "1": {
        "rep_range_desc": "Độ dài cạnh tăng lên 12 mét. Tiêu hao tăng thêm 3000 mp",
        "extra_cost": {
          "mp": 3000,
          "hp": 0,
          "sp": 0
        }
      },
      "2": {
        "rep_range_desc": "Độ dài cạnh tăng lên 24 mét. Tiêu hao tăng thêm 6000 mp",
        "extra_cost": {
          "mp": 6000,
          "hp": 0,
          "sp": 0
        }
      },
      "limit": {
        "add_desc": "(Có thể chọn từ cấp bậc 4 trở lên) Độ dài cạnh tăng lên không giới hạn. Tiêu hao tăng thêm 50% mp tối đa",
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
    "quality_limit": "Sử thi",
    "range_desc": "Tùy chỉnh",
    "target_desc": "Sự am hiểu về chú tự của bạn không ai sánh kịp, bạn có thể tự mình xác định phạm vi mục tiêu và hình thái phép thuật",
    "boost": {
      "total_level": 0
    }
  },
  "target_curtain_of_stars_hidden": {
    "uid": "target_curtain_of_stars_hidden",
    "name": "Bức màn phồn tinh",
    "quality_limit": "Sử thi",
    "range_desc": "Cự ly xa (120 mét + 12 mét/CL)",
    "target_desc": "Trong phạm vi, vạch ra khu vực có chu vi không quá 24 mét mỗi CL được che đậy bởi bức màn phồn tinh vô hình, đồng thời tạo ra 5 ngôi sao chứa tổ hợp phép thuật hoàn chỉnh (chú tự mục tiêu được coi là 'lựa chọn'). Hoàn toàn không thể nhìn thấy bằng mắt thường (có thể bị phát hiện bởi hiệu ứng nhìn thấu tàng hình, và có linh quang phép thuật trung bình. Nếu trong đêm tối, không thể bị nhìn thấu và chỉ có linh quang phép thuật lờ mờ). Bất kỳ sinh vật nào đi vào bức màn sẽ bị ảnh hưởng bởi hiệu ứng tương tự như thuật mê cung, mỗi hiệp có thể thực hiện kiểm định trí tuệ DC=30 để thử trốn thoát, nếu kiểm định thất bại, sẽ tiêu hao một ngôi sao và bị ngôi sao tấn công. Khi không có sinh vật nào đi vào, bức màn có thể duy trì vô hạn thời gian, sau khi sinh vật đầu tiên đi vào sẽ bắt đầu tính giờ, sau 10 phút hoặc sau khi tất cả các ngôi sao bị tiêu hao hết sẽ tự nhiên biến mất, bạn có thể giải trừ nó bất cứ lúc nào",
    "boost": {
      "total_level": 0
    }
  }
}