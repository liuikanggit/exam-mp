const devHost = 'http://192.168.1.104:8082'
const proHost = 'https://www.liukang666.cn'

export default (process.env.NODE_ENV === 'development' ? devHost : proHost)