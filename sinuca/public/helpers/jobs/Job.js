const queues = require('./Queues')

class Job {
  //Construtores
  static create(jobName, payload = {}, options = {}) {
    return new Job(jobName, payload, options)
  }

  constructor(jobName, payload = {}, options = {}) {
    this.jobName = jobName
    this.payload = payload
    this.options = this.constructor.buildOptions(options)
    this.chain = []
    this.currentJob = null
  }

  chained(jobName, payload = {}, options = {}) {
    this.chain.push([
      jobName,
      payload,
      this.constructor.buildOptions((options = {})),
    ])
    return this
  }

  static buildOptions(options = {}) {
    return {
      delay: options.delay || null,
      priority: options.priority || null,
      attempts: process.env.APP_ENV === 'development' ? 1 : 4,
      backoff: { type: 'exponential' },
      removeOnComplete: true,
    }
  }

  //dispatch
  jobData() {
    return {
      jobName: this.jobName,
      payload: this.payload,
      chain: this.chain,
    }
  }

  buildParams(queueName, delay = null) {
    return [
      queueName,
      this.jobData(),
      delay === null
        ? this.options
        : {
            ...this.options,
            delay,
          },
    ]
  }

  dispatch(queueName = 'defaultQueue', delay = null) {
    return queues.get(queueName).add(...this.buildParams(queueName, delay))
  }
}

module.exports = Job
