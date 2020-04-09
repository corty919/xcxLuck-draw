// 上下文对象
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideRulePop: true, // 隐藏抽奖规则弹窗
    hideLotteryPop: true, // 隐藏奖品弹窗

    is_play: false,// 是否在运动中，避免重复启动bug
    available_num: 0,// 可用抽奖的次数，可自定义设置或者接口返回
    start_angle: 0,// 转动开始时初始角度=0位置指向正上方，按顺时针设置，可自定义设置
    base_circle_num: 9,// 基本圈数，就是在转到（最后一圈）结束圈之前必须转够几圈 ，可自定义设置
    low_circle_num: 5,// 在第几圈开始进入减速圈（必须小于等于基本圈数），可自定义设置
    add_angle: 10,// 追加角度，此值越大转动越快，请保证360/add_angle=一个整数，比如1/2/3/4/5/6/8/9/10/12等
    use_speed: 1,// 当前速度，与正常转速值相等
    nor_speed: 1,// 正常转速，在减速圈之前的转速，可自定义设置
    low_speed: 10,// 减速转速，在减速圈的转速，可自定义设置
    end_speed: 20,// 最后转速，在结束圈的转速，可自定义设置
    random_angle: 0,// 中奖角度，也是随机数，也是结束圈停止的角度，这个值采用系统随机或者接口返回
    change_angle: 0,// 变化角度计数，0开始，一圈360度，基本是6圈，那么到结束这个值=6*360+random_angle；同样change_angle/360整除表示走过一整圈
    result_val: "未中奖",// 存放奖项容器，可自定义设置
    Jack_pots: [// 奖项区间 ，360度/奖项个数 ，一圈度数0-360，可自定义设置
      // random_angle是多少，在那个区间里面就是中哪个奖项
      {
        startAngle: 0,
        endAngle: 45,
        val: "1等奖"
      },
      {
        startAngle: 46,
        endAngle: 90,
        val: "2等奖"
      },
      {
        startAngle: 91,
        endAngle: 135,
        val: "3等奖"
      },
      {
        startAngle: 136,
        endAngle: 180,
        val: "4等奖"
      },
      {
        startAngle: 181,
        endAngle: 225,
        val: "5等奖"
      },
      {
        startAngle: 226,
        endAngle: 270,
        val: "6等奖"
      },
      {
        startAngle: 271,
        endAngle: 315,
        val: "7等奖"
      },
      {
        startAngle: 316,
        endAngle: 360,
        val: "8等奖"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // that.luckDrawStart();
  },

  /**
   * 启动抽奖
   */
  luckDrawStart: function () {
    // 阻止运动中重复点击
    if (!that.data.is_play) {
      // 设置标识在运动中
      that.setData({
        is_play: true
      });
      // 重置参数
      that.luckDrawReset();
      // 几率随机，也可从服务端获取几率
      that.setData({
        random_angle: Math.ceil(Math.random() * 360)
      });
      // 运动函数
      setTimeout(that.luckDrawChange, that.data.use_speed);
    };
  },

  /**
   * 转盘运动
   */
  luckDrawChange: function () {
    // 继续运动
    if (that.data.change_angle >= that.data.base_circle_num * 360 + that.data.random_angle) {// 已经到达结束位置
      // 提示中奖，
      that.getLuckDrawResult();
      // 运动结束设置可用抽奖的次数和激活状态设置可用
      that.luckDrawEndset();
    } else {// 运动
      if (that.data.change_angle < that.data.low_circle_num * 360) {// 正常转速
        // console.log("正常转速")
        that.data.use_speed = that.data.nor_speed
      } else if (that.data.change_angle >= that.data.low_circle_num * 360 && that.data.change_angle <= that.data.base_circle_num * 360) {// 减速圈
        // console.log("减速圈")
        that.data.use_speed = that.data.low_speed
      } else if (that.data.change_angle > that.data.base_circle_num * 360) {// 结束圈
        // console.log("结束圈")
        that.data.use_speed = that.data.end_speed
      }
      // 累加变化计数
      that.setData({
        change_angle: that.data.change_angle + that.data.add_angle >= that.data.base_circle_num * 360 + that.data.random_angle ? that.data.base_circle_num * 360 + that.data.random_angle : that.data.change_angle + that.data.add_angle
      });
      setTimeout(that.luckDrawChange, that.data.use_speed);
    }

  },

  /**
   * 重置参数
   */
  luckDrawReset: function () {
    // 转动开始时首次点亮的位置，可自定义设置
    that.setData({
      start_angle: 0
    });
    // 当前速度，与正常转速值相等
    that.setData({
      use_speed: that.data.nor_speed
    });
    // 中奖索引，也是随机数，也是结束圈停止的位置，这个值采用系统随机或者接口返回
    that.setData({
      random_angle: 0
    });
    // 变化计数，0开始，必须实例有12个奖项，基本是6圈，那么到结束这个值=6*12+random_number；同样change_num/12整除表示走过一整圈
    that.setData({
      change_angle: 0
    });
  },

  /**
   * 获取抽奖结果
   */
  getLuckDrawResult: function () {
    for (var j = 0; j < that.data.Jack_pots.length; j++) {
      // 随机获取的值再
      if (that.data.random_angle >= that.data.Jack_pots[j].startAngle && that.data.random_angle <= that.data.Jack_pots[j].endAngle) {
        that.setData({
          result_val: that.data.Jack_pots[j].val
        });
        // wx.showModal({
        //   title: '抽奖结果',
        //   content: that.data.Jack_pots[j].val,
        // })
        that.setData({
          hideLotteryPop: false
        })
        break;
      };
    };
  },

  /**
   * 更新状态（运动结束设置可用抽奖的次数和激活状态设置可用）
   */
  luckDrawEndset: function () {
    // 是否在运动中，避免重复启动bug
    that.setData({
      is_play: false
    })
    // 可用抽奖的次数，可自定义设置
    that.setData({
      available_num: that.data.available_num - 1
    });
  },

  // 打开抽奖规则弹窗
  openRule() {
    this.setData({
      hideRulePop: false
    })
  },

  // 规则弹窗确定键
  popSubmit() {
    this.setData({
      hideRulePop: true
    })
  },

  // 关闭弹窗
  popClose() {
    this.setData({
      hideLotteryPop: true
    })
  },
})