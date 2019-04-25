// const devHost = 'http://192.168.1.104:8082'
// const devHost = 'http://192.168.71.70:8082'
const devHost = 'http://127.0.0.1:8082'
const proHost = 'https://www.liukang666.cn'

export default (process.env.NODE_ENV === 'development' ? devHost : proHost)