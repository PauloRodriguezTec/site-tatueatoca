# Configuração do Formulário de Contato

Para o formulário de contato funcionar automaticamente, você precisa:

## 1. Criar conta no EmailJS (gratuito)
- Acesse: https://www.emailjs.com/
- Clique em "Sign Up Free"
- Crie sua conta com email e senha

## 2. Conectar Gmail
- No dashboard do EmailJS, vá para "Email Services"
- Clique em "Add Service"
- Selecione "Gmail"
- Siga as instruções para conectar sua conta tatueatoca@gmail.com

## 3. Criar Template
- Vá para "Email Templates"
- Clique em "Create New Template"
- Configure assim:
  - **Template Name**: `template_contact`
  - **Subject**: `Nova mensagem de {{user_email}}`
  - **Body**:
    ```
    Você recebeu uma nova mensagem:

    De: {{user_email}}
    Mensagem: {{message}}
    ```
- Salve o template

## 4. Pegar sua Public Key
- No painel do EmailJS, clique no seu perfil
- Vá para "API Keys"
- Copie sua **Public Key**

## 5. Atualizar o arquivo contact.js
- Abra: `js/contact.js`
- Encontre a linha: `emailjs.init("YOUR_PUBLIC_KEY");`
- Substitua `YOUR_PUBLIC_KEY` pela sua chave pública do EmailJS

Exemplo:
```javascript
emailjs.init("abc123def456ghi789");
```

## 6. Pronto! 
Agora o formulário de contato funciona! Os emails serão enviados para tatueatoca@gmail.com automaticamente quando alguém preencher o formulário.

### Dicas:
- A chave pública é segura para expor no frontend (não use a chave privada!)
- O EmailJS tem limite de emails gratuitos (até 200/mês no plano free)
- Teste com um email real para confirmar que está funcionando
