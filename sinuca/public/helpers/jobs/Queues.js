const Queue = require('bull')
const queueConfig = require('../../../config/queue')

class Queues {
  constructor() {
    this.queues = {}
  }

  get(queueName) {
    if (this.queues[queueName]) {
      return this.queues[queueName]
    }
    this.queues[queueName] = new Queue(queueName, queueConfig)
    return this.queues[queueName]
  }
}

module.exports = new Queues()
