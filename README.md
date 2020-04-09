# xcxLuck-draw


很多应用中都会存在抽奖的需求，而且这种功能也很常见，最近在项目中我也遇到了这样的需求。对其探讨如下：

我遇到的是商品需积分抽奖，而且不会存在于不中奖的情况，不过也可以根据自己的需求来在我这个demo上的需求进行修改。

### 1.需求
	消耗一定的积分，进行一次抽奖，在抽奖完成以后，需扣除对应的积分。
	

 - 开始 转动时速度很慢
 - 转动过程中很快
 - 结束时，拿到后台的中奖信息，转盘速度变慢

### 2.实现(转盘抽奖)
由于项目中设定了8个奖项，所以需要设置8个区间
区间| [0,45]|[46,90]|[91,135]|[136,180]|[181,225]|[226,270]|[271,315]|[316,360]
-------- | -----| -----|-----| -----| -----|-----| -----| -----
奖项| 1等奖|2等奖| 3等奖|4等奖| 5等奖| 6等奖|7等奖| 8等奖

 1. 通过随机数，给定一个中奖角度
 2. 设定转盘的旋转的圈数，并且不断累加角度（目的是转动多圈），其终止条件是**旋转角度>圈数*360+中奖角度**
 3. 根据中奖角度找到对应的奖项
#### 2.1 代码
略
### 3.最终效果
![image](https://github.com/corty919/xcxLuck-draw/blob/master/draw.gif)
