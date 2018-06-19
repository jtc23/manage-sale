/**
 * Created by Leevare on 2017/12/10.
 */
const errLog = {
  state: {
    errLog: []
  },
  pushLog(log) {
    this.state.errLog.unshift(log)
  },
  clearLog() {
    this.state.errLog = []
  }
}

export default errLog
