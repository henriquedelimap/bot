
import parsePhoneNumber, { isValidPhoneNumber} from "libphonenumber-js"
import { create, Whatsapp, Message, SocketState } from "venom-bot"

//estabeler os tipos contidos em QRCode que será usado ao longo do cógido
export type QRCode = {
  base64Qr: string
  //asciiQR: string
  attempts: number
  //urlCode: string
}

class Sender{

  //cria as variáveis e define o tipo
  private client: Whatsapp
  private connected: boolean
  private qr: QRCode

  //envia o valor da variável connected pro caminho /status
  get isConnected(): boolean {
    return this.connected 
  }
  //envia o qrcode pro cominho /status
  get qrCode(): QRCode {
    return this.qr
  }

  //Construtor da classe que vai executar a função initialize()
  constructor(){
      this.initialize()
  }


  //manda mensagem 
  async sendText(to: string, body: string){
    let phoneNumber = parsePhoneNumber(to, "BR")
    ?.format("E.164")
    ?.replace("+", "") as string

  phoneNumber = phoneNumber.includes("@c.us") 
  ? phoneNumber 
  : `${phoneNumber}@c.us`

    console.log("phoneNumber: ", phoneNumber)
    await this.client.sendText(phoneNumber, body)
  }

  //MANDA LOCALIZAÇÃO
  async sendLocation(to: string){
      let phoneNumber = parsePhoneNumber(to, "BR")
      ?.format("E.164")
      ?.replace("+", "") as string

    phoneNumber = phoneNumber.includes("@c.us") 
    ? phoneNumber 
    : `${phoneNumber}@c.us`

    this.client.sendLocation(phoneNumber, '-13.6561589', '-69.7309264', 'Brasil')
  }
  
  //INICIALIZA função será chamada pelo construtor da classe 
  private initialize(){
    //cria as variáveis
    const venom = require('venom-bot');

    const qr = (
      base64Qr: string, 
      asciiQR: string, 
      attempts: number, 
      urlCode: string 
    ) => {
      this.qr = {base64Qr, /*asciiQR, urlCode,*/ attempts}
    }

    //rotina para verificar o status, retornando informacoes no terminal
    const status = (statusSession: string, session: string) => {
      console.log('Status Session: ', statusSession);
      console.log('Session name: ', session);

      //verifica se isLogged, qeRewadSucess e chatsAvailable está incluido no statusSession e passa o valor para a variável connected
      this.connected = ["isLogged", "qrRewadSucess", "chatsAvailable"].includes(statusSession)
    }

    //funcão que sera1 chamada pelo create() para startar 
    const start = (client: Whatsapp)=> {
      this.client = client
      //this.sendText("5534992899688@c.us", "te amo tanto, minino, você é O <3 DA MINHA VIDAAAA XD")

      //verifica se o estado da conexão mudou, caso tenha mudado, passa o valor para variável connected
      client.onStateChange((state)=>{
        this.connected = state === SocketState.CONNECTED
      })
    }

    //criar uma sessão, gerar um qrCode e informar o status
    venom.create('whats', qr, status)
      .then((client: Whatsapp) => {
        start(client);
      })
      .catch((erro: string) => {
        console.log(erro);
    });
  }

}

export default Sender
