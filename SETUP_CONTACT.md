# Manual de Configuração do Formulário de Contato

Este guia ensina como deixar o formulário de contato funcionando com EmailJS. Siga cada passo na ordem.

## 1. Crie sua conta no EmailJS
1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up Free".
3. Crie a conta usando seu email e senha.
4. Confirme o email, se necessário.

## 2. Adicione um serviço de e-mail
1. Entre no painel do EmailJS.
2. Abra a seção "Email Services".
3. Clique em "Add Service".
4. Escolha "Gmail" (ou outro serviço suportado).
5. Conecte a conta de email que vai receber as mensagens, por exemplo:
   - tatueatoca@gmail.com
6. Complete as etapas de autorização.

## 3. Crie um template de e-mail
1. No painel do EmailJS, vá para "Email Templates".
2. Clique em "Create New Template".
3. Configure o template com estes valores:
   - **Template Name**: `template_contact`
   - **Subject**: `Nova mensagem de {{user_email}}`
   - **Body**:
     ```
     Você recebeu uma nova mensagem:

     De: {{user_email}}
     Mensagem: {{message}}
     ```
4. Salve o template.

> Importante: os nomes de variável devem ser iguais aos usados no JavaScript: `user_email` e `message`.

## 4. Copie sua Public Key do EmailJS
1. No painel do EmailJS, clique no seu perfil ou em "Integration".
2. Encontre a seção de **API Keys**.
3. Copie a **Public Key**.

## 5. Atualize `js/contact.js`
1. Abra o arquivo `js/contact.js`.
2. Localize a linha com `emailjs.init("YOUR_PUBLIC_KEY");`.
3. Substitua `YOUR_PUBLIC_KEY` pela sua chave do EmailJS.

Exemplo:
```javascript
emailjs.init("YGrdDkNnVxV0Ly7zeF");
```

## 6. Verifique o HTML do formulário
O formulário deve ter estes IDs:
- `id="contactForm"`
- `id="email"`
- `id="message"`
- `id="statusMessage"`

E o script deve ser carregado após o EmailJS:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>
<script src="../js/contact.js"></script>
```

## 7. Teste o envio
1. Abra `pages/contact.html` no navegador.
2. Preencha o email e a mensagem.
3. Clique em "Enviar".
4. Verifique se aparece a mensagem de sucesso:
   - `✓ Sua mensagem foi enviada! Em breve entraremos em contato.`

## Erros comuns e soluções
- Se o console mostrar `EmailJS não foi carregado`, verifique se o script CDN está presente e antes do `contact.js`.
- Se o envio falhar, confira:
  - `service_tatueatoca` está ativo no EmailJS.
  - `template_contact` existe.
  - As variáveis do template são `user_email` e `message`.
  - A senha ou autorização do Gmail estão corretas.

## Dicas finais
- A Public Key do EmailJS pode ficar no frontend, pois é pública.
- Não compartilhe a sua chave privada do EmailJS.
- O plano gratuito tem limite de envios mensais.
- Use um email real para testar o envio e receber a mensagem.
