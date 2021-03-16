<template>
  <el-col :sm="24" :lg="12">
    <el-card shadow="hover" class="system-report surplus">
      <div slot="header" class="report-header">
        <span>各类型房间剩余</span>
      </div>
      <div class="progress-group" v-if="show === true">
        <el-progress
          :width="100"
          type="circle"
          :percentage="100 - 100 * (surplus[0] / allRoom[0])"
          color="#556D84"
          :format="format('单人间',0)"
          ></el-progress
        >
        <el-progress
          :width="100"
          type="circle"
          :percentage="100 - 100 * (surplus[1] / allRoom[1])"
          color="#41B883"
          :format="format('双人间',1)"
          ></el-progress
        >
        <el-progress
          :width="100"
          type="circle"
          :percentage="100 - 100 * (surplus[2] / allRoom[2])"
          color="#9AB7E0"
          :format="format('三人间',2)"
          ></el-progress
        >
        <el-progress
          :width="100"
          type="circle"
          :percentage="100 - 100 * (surplus[3] / allRoom[3])"
          color="#F7C94D"
          :format="format('商务间',3)"
          ></el-progress
        >
        <el-progress
          :width="100"
          type="circle"
          :percentage="100 - 100 * (surplus[4] / allRoom[4])"
          color="#e45f5f"
          :format="format('总统间',4)"
          ></el-progress
        >
      </div>
    </el-card>
  </el-col>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      doubleRoom: 0,
      allRoom: [0, 0, 0, 0, 0],
      surplus: [0, 0, 0, 0, 0],
      AllDoubleRoom: 0,
    };
  },
  mounted() {
    this.getAllRoom();
  },
  methods: {
    format(obj,index) {
      let that = this;
      return () => {
             return obj+(that.allRoom[index]-that.surplus[index])+'间';
    	}
      },
    getAllRoom() {
      this.getRequest("/getAllRoom").then((res) => {
        // console.log(res)
        if (res.code === 200) {
          let dataArr = res.data;
          let tmpObj = {};
          for (let i = 0; i < dataArr.length; i++) {
            var key = dataArr[i].roomType;
            if (
              dataArr[i].roomType === "单人间" &&
              dataArr[i].roomState === 1
            ) {
              this.surplus[0] += 1;
            } else if (
              dataArr[i].roomType === "双人间" &&
              dataArr[i].roomState === 1
            ) {
              this.surplus[1] += 1;
            } else if (
              dataArr[i].roomType === "三人间" &&
              dataArr[i].roomState === 1
            ) {
              this.surplus[2] += 1;
            } else if (
              dataArr[i].roomType === "商务间" &&
              dataArr[i].roomState === 1
            ) {
              this.surplus[3] += 1;
            } else if (
              dataArr[i].roomType === "总统间" &&
              dataArr[i].roomState === 1
            ) {
              this.surplus[4] += 1;
            }

            switch (dataArr[i].roomType) {
              case "单人间":
                this.allRoom[0] += 1;
                break;
              case "双人间":
                this.allRoom[1] += 1;
                break;
              case "三人间":
                this.allRoom[2] += 1;
                break;
              case "商务间":
                this.allRoom[3] += 1;
                break;
              case "总统间":
                this.allRoom[4] += 1;
                break;
            }
          }
          this.show = true;
          // console.log(this.allRoom,this.surplus)
        } else {
          this.$router.push({ path: "/login" });
        }
      });
    },
  },
};
</script>


<style lang="less" scoped>
.system-report {
  margin-top: 15px;
}
.progress-group {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.report-header {
  font-weight: bold;
  color: #409eff;
}
</style>
