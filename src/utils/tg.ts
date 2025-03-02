const botname = import.meta.env.VITE_BOT_NAME
const appname = import.meta.env.VITE_MINIAPP_NAME

class TgUtils {
    getWebAppUrl() {
        return `https://t.me/${botname}/${appname}`
    }
    
    getBotUrl() {
        return `https://t.me/${botname}`
    }
}

export default new TgUtils()