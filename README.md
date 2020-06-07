# eColeta
#NextLevelWeek Aplicação que proporciona a destinação correta de resíduos
Para visualizar a prototipação do projeto [clique aqui](https://www.figma.com/file/9TlOcj6l7D05fZhU12xWT3/Ecoleta-(Booster)?node-id=0%3A1)

## Iniciando o **Node.JS**
### Para iniciar um projeto node utilizar:
```bash
$ npm init -y
$ npm install express
```
<br/>

## Configurando e Utilizando **TypeScript**
### Tipagem para o *express*
```bash
$ npm install @types/express -D
```

**Obs:** "-D" para dependência de desenvolvimento! 

<br/>

### Instalando o TS
```bash
$ npm install ts-node -D
$ npm install typescript -D
```

<br/>

### Criando arquivo de configuração TS
```bash
$ npx tsc --init
```
<br/>

### Gerando JS
```bash
$ npx ts-node <dir>
```
<br/>

### Pacote para reiniciar o server automaticamente
```bash
$ npm install ts-node-dev -D
$ npx ts-node-dev <dir>
```
<br/>

## Configurando **ts-node-dev** no package.json
### Para reiniciar automaticamente o servidor ao salvar arquivos. 
Em *package.json*:
```json
"scripts": {
  "dev": "ts-node-dev <dir>"
}
```
```bash
$ npm run dev
# ou
$ yarn dev
```

<br/>

## Iniciando projeto React
```bash
$ npx create-react-app web --template=typescript
```

<br/>

### Recomendações:
- Whimsical: Aplicação web para criação de Fluxogramas

- Figma: Aplicação web para Prototipação / Wireframe

- Notion: To-do List
<br/>
