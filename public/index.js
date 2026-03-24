let slideIndex = 1;
let slideTimer;


// Quando a página carregar
document.addEventListener("DOMContentLoaded", function () {
  showSlides(slideIndex);
  startAutoSlide();
});

// Inicia o timer automático
function startAutoSlide() {
  slideTimer = setInterval(function () {
    plusSlides(1);
  }, 5000); // 5 segundos
}

// Reseta o timer quando clicar manualmente
function resetTimer() {
  clearInterval(slideTimer);
  startAutoSlide();
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("/usuario-logado")
        .then(res => res.json())
        .then(data => {
            // Note que usamos 'data.success' e 'data.usuario' conforme seu controller
            if (data.success && data.usuario) {
                const usuario = data.usuario;

                // 1. Atualiza o Nome no Menu (Olá, Vinicius!)
                const nameDisplay = document.getElementById("user-name");
                if (nameDisplay) {
                    nameDisplay.innerText = `Olá, ${usuario.nome}!`;
                }

                // 2. Atualiza a Foto Circular no Menu
                if (usuario.foto) {
                    const fotoUrl = `/uploads/${usuario.foto}`;
                    const fotoDiv = document.getElementById("user-photo");
                    if (fotoDiv) {
                        fotoDiv.style.backgroundImage = `url('${fotoUrl}')`;
                        fotoDiv.style.backgroundSize = "cover";
                        fotoDiv.style.backgroundPosition = "center";
                    }
                }
                
                // 3. Atualiza o Título Principal (opcional, se você tiver o ID)
                const welcomeH1 = document.getElementById("user-welcome");
                if (welcomeH1) welcomeH1.innerText = usuario.nome;
            }
        })
        .catch(err => console.error("Erro ao carregar dados do usuário:", err));
});

// Próximo / Anterior
function plusSlides(n) {
  showSlides(slideIndex += n);
  resetTimer();
}
document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/usuario-logado") // Ajuste o caminho se sua rota for diferente
        .then(res => res.json())
        .then(data => {
            // Seu controller envia { success: true, usuario: {...} }
            if (data.success && data.usuario) {
                const usuario = data.usuario;

                // 1. Atualiza o Nome no Menu
                const nameDisplay = document.getElementById("user-name");
                if (nameDisplay) {
                    nameDisplay.innerText = `Olá, ${usuario.nome}!`;
                }

                // 2. Atualiza a Foto no Menu (o círculo cinza da imagem)
                if (usuario.foto) {
                    const fotoUrl = `/uploads/${usuario.foto}`;
                    const fotoDiv = document.getElementById("user-photo");
                    if (fotoDiv) {
                        fotoDiv.style.backgroundImage = `url('${fotoUrl}')`;
                        fotoDiv.style.backgroundSize = "cover";
                        fotoDiv.style.backgroundPosition = "center";
                        fotoDiv.innerHTML = ""; // Remove ícones se houver
                    }
                }
                
                // 3. Atualiza o H1 de boas-vindas se existir na página
                const welcomeH1 = document.getElementById("user-welcome");
                if (welcomeH1) welcomeH1.innerText = usuario.nome;
            } else {
                // Se não estiver logado e tentar acessar uma página -user, volta pro login
                if (window.location.pathname.includes("-user.html")) {
                    window.location.href = "login.html";
                }
            }
        })
        .catch(err => console.error("Erro ao carregar dados:", err));
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("/usuario-logado")
        .then(res => res.json())
        .then(data => {
            // O seu controller envia { success: true, usuario: {...} }
            if (data.success && data.usuario) {
                const usuario = data.usuario;

                // 1. Atualiza Nome e Email na página de perfil
                document.getElementById("display-name").innerText = usuario.nome;
                document.getElementById("user-name-nav").innerText = `Olá, ${usuario.nome.split(' ')[0]}!`;
                document.getElementById("display-email").innerText = usuario.email;
                document.getElementById("display-address").innerText = usuario.endereco || "Não cadastrado";

                // 2. Aplica a Foto de Perfil (Círculo Central e Nav)
                if (usuario.foto) {
                    const fotoUrl = `/uploads/${usuario.foto}`;
                    document.getElementById("profile-img").src = fotoUrl;
                    const navPhoto = document.getElementById("user-photo");
                    if (navPhoto) {
                        navPhoto.style.backgroundImage = `url('${fotoUrl}')`;
                        navPhoto.style.backgroundSize = "cover";
                    }
                }

                // 3. Aplica o Banner
                if (usuario.banner) {
                    const bannerUrl = `/uploads/${usuario.banner}`;
                    document.getElementById("display-banner").style.backgroundImage = `url('${bannerUrl}')`;
                }
            }
        });
});

// Ir para slide específico
function currentSlide(n) {
  showSlides(slideIndex = n);
  resetTimer();
}

function showSlides(n) {
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  if (slides.length === 0) return;

  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }

  // Esconde todos
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Remove active dos dots
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  // Mostra o atual
  slides[slideIndex - 1].style.display = "block";

  if (dots.length > 0) {
    dots[slideIndex - 1].classList.add("active");
  }
}

// --- NOVO: SISTEMA DE VER SENHA ---
function toggleSenha() {
  const inputSenha = document.getElementById('input-senha');
  const iconAberto = document.getElementById('icon-aberto');
  const iconFechado = document.getElementById('icon-fechado');

  if (inputSenha.type === 'password') {
    // Mostra a senha
    inputSenha.type = 'text';
    iconAberto.style.display = 'none';
    iconFechado.style.display = 'block';
  } else {
    // Esconde a senha
    inputSenha.type = 'password';
    iconAberto.style.display = 'block';
    iconFechado.style.display = 'none';
  }
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("/usuario-logado")
        .then(res => res.json())
        .then(usuario => {
            if (usuario) {
                // Preenche o nome
                const nameDisplay = document.getElementById("user-name");
                if (nameDisplay) nameDisplay.innerText = `Olá, ${usuario.nome}!`;

                // Preenche a foto
                const photoDisplay = document.getElementById("user-photo");
                if (photoDisplay && usuario.foto) {
                    photoDisplay.style.backgroundImage = `url('/uploads/${usuario.foto}')`;
                    photoDisplay.style.backgroundSize = "cover";
                    photoDisplay.style.backgroundPosition = "center";
                }
            } else {
                // Se não houver usuário, redireciona para login (opcional)
                window.location.href = "login.html";
            }
        })
        .catch(err => console.error("Erro ao carregar dados do usuário:", err));
});

// Esta parte deve rodar APENAS se estiver na página inicio-user.html
if (window.location.pathname.includes("inicio-user.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        fetch("/usuario-logado")
            .then(res => res.json())
            .then(usuario => {
                if (usuario) {
                    const nameDisplay = document.getElementById("user-name");
                    const photoDisplay = document.getElementById("user-photo");

                    if (nameDisplay) nameDisplay.innerText = `Olá, ${usuario.nome}!`;

                    if (photoDisplay && usuario.foto) {
                        photoDisplay.style.backgroundImage = `url('/uploads/${usuario.foto}')`;
                        photoDisplay.style.backgroundSize = "cover";
                        photoDisplay.style.backgroundPosition = "center";
                    }
                } else {
                    // Se não estiver logado, volta para o login
                    window.location.href = "login.html";
                }
            })
            .catch(err => console.error("Erro ao carregar dados:", err));
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const btnUser = document.querySelector(".useri");
    const menuInfs = document.querySelector(".user-infs");

    if (btnUser && menuInfs) {
        btnUser.addEventListener("click", (e) => {
            e.stopPropagation(); // Impede de fechar imediatamente ao clicar
            menuInfs.classList.toggle("active");
            btnUser.classList.toggle("rotate");
        });
    }

    // Fecha o menu se clicar em qualquer outro lugar da tela
    document.addEventListener("click", () => {
        if (menuInfs.classList.contains("active")) {
            menuInfs.classList.remove("active");
            btnUser.classList.remove("rotate");
        }
    });
});

// No seu script do cardapio-user.html, adicione esta função:
function adicionarAoCarrinho(idProduto) {
    fetch("/adicionar-carrinho", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produto_id: idProduto })
    })
    .then(res => res.json())
    .then(data => alert(data.mensagem))
    .catch(err => console.error("Erro:", err));
}

// No HTML, altere o botão:
// <button onclick="adicionarAoCarrinho(1)" class="btn-comprar"> Adicionar </button>

function renderizarCarrinho() {
    fetch("/meu-carrinho")
        .then(res => res.json())
        .then(itens => {
            const container = document.querySelector(".carrinho");
            let subtotal = 0;
            
            // Calcula subtotal
            itens.forEach(item => subtotal += parseFloat(item.preco));
            
            const taxaEntrega = 7.00; // Taxa fixa fictícia
            const total = subtotal + taxaEntrega;

            container.innerHTML = `
                <h1>Meu Carrinho</h1>
                <p>Produtos selecionados: ${itens.length}</p>
                <hr>
                <input type="text" id="endereco" placeholder="Digite seu endereço para o entregador">
                <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
                <p>Taxa de Entrega: R$ ${taxaEntrega.toFixed(2)}</p>
                <h2>Total: R$ ${total.toFixed(2)}</h2>
                <button onclick="finalizarPedido(${total}, ${taxaEntrega})">Finalizar Pedido</button>
            `;
        });
}
const btnDarkMode = document.querySelector('.darkmode');
const themeLink = document.querySelector('#theme-link');

btnDarkMode.addEventListener('click', () => {
    // Verifica se o href atual contém 'style-dark.css'
    if (themeLink.getAttribute('href').includes('style-dark.css')) {
        themeLink.setAttribute('href', 'style.css'); // Volta pro Light
        btnDarkMode.classList.remove('active');
    } else {
        themeLink.setAttribute('href', 'style-dark.css'); // Vai pro Dark
        btnDarkMode.classList.add('active');
    }
});
document.addEventListener("DOMContentLoaded", () => {
    fetch("/usuario-logado")
        .then(res => res.json())
        .then(usuario => {
            if (usuario) {
                // 1. Atualiza o Menu Superior (o que você já tinha)
                document.querySelector(".user div:last-child").innerText = `Olá, ${usuario.nome}!`;
                
                // 2. Atualiza a Página de Perfil (Banner e Nome)
                document.getElementById("display-name").innerText = `Seu nome: ${usuario.nome}`;
                if(document.getElementById("display-email")) {
                    document.getElementById("display-email").innerText = `E-mail: ${usuario.email || 'Não informado'}`;
                }

                // 3. Atualiza as Fotos (Menu e Banner)
                if (usuario.foto) {
                    const fotoUrl = `/uploads/${usuario.foto}`;
                    
                    // Foto do Menu
                    const fotoDiv = document.querySelector(".foto-user");
                    fotoDiv.style.backgroundImage = `url('${fotoUrl}')`;
                    fotoDiv.style.backgroundSize = "cover";

                    // Foto do Banner
                    const profileImg = document.getElementById("profile-img");
                    if(profileImg) profileImg.src = fotoUrl;
                }
            }
        })
        .catch(err => console.error("Erro ao carregar dados:", err));
});

function abrirEdicao() {
    // Aqui você pode redirecionar para uma página de formulário
    // ou abrir um modal. Exemplo de redirecionamento:
    window.location.href = "editar-perfil.html";
}




function mudarSlide(n) {
    const slides = document.getElementsByClassName("meu-slide");
    
    // Remove a classe ativo do slide atual
    slides[slideIndex].classList.remove("ativo");
    
    slideIndex += n;
    
    // Volta ao início ou vai para o fim se ultrapassar os limites
    if (slideIndex >= slides.length) { slideIndex = 0; }
    if (slideIndex < 0) { slideIndex = slides.length - 1; }
    
    // Adiciona a classe ativo no novo slide
    slides[slideIndex].classList.add("ativo");
}
function typeWriter(elemento) {
        const textoArray = elemento.innerHTML.split('');
        elemento.innerHTML = '';
        elemento.classList.add('digitando'); // O cursor entra aqui e não sai mais

        textoArray.forEach((letra, i) => {
            setTimeout(() => {
                elemento.innerHTML += letra;
            }, 75 * i); 
        });
}

    document.addEventListener("DOMContentLoaded", () => {
        const titulos = document.querySelectorAll('.typewriter');
        titulos.forEach(titulo => typeWriter(titulo));
    });

    document.addEventListener("DOMContentLoaded", () => {
        // Seleciona todos os elementos que você quer que "escrevam"
        const titulos = document.querySelectorAll('.typewriter');
        titulos.forEach(titulo => typeWriter(titulo));
    });