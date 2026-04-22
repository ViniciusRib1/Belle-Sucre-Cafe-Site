
// Quando a página carregar
document.addEventListener("DOMContentLoaded", function () {
  showSlides(slideIndex);
  startAutoSlide();
});



document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/usuario-logado")
        .then(res => res.json())
        .then(data => {
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

document.addEventListener("DOMContentLoaded", () => {
        // Busca os dados na rota correta da API
        fetch("/api/usuario-logado") 
            .then(res => {
                if (!res.ok) {
                    // Se o servidor retornar erro (401), manda de volta pro login
                    console.log("Sessão inválida, redirecionando...");
                    window.location.href = "login.html";
                    return;
                }
                return res.json();
            })
            .then(usuario => {
                if (usuario && usuario.nome) {
                    // 1. Atualiza o texto "Olá, Visitante"
                    const nameDiv = document.getElementById("user-name");
                    if (nameDiv) nameDiv.innerText = `Olá, ${usuario.nome}!`;

                    // 2. Atualiza o H1 principal se você der a ele o id="user-welcome"
                    // No seu HTML mude: <h1 class="titulo-principal"> para <h1 id="user-welcome" class="titulo-principal">
                    const welcomeH1 = document.getElementById("user-welcome");
                    if (welcomeH1) welcomeH1.innerText = `Olá, ${usuario.nome}! Seja bem-vindo ao Belle Sucré Café!`;

                    // 3. Atualiza a Foto do Menu
                    if (usuario.foto) {
                        const fotoUrl = `/uploads/${usuario.foto}`;
                        const fotoDiv = document.getElementById("user-photo");
                        if (fotoDiv) {
                            fotoDiv.style.backgroundImage = `url('${fotoUrl}')`;
                            fotoDiv.style.backgroundSize = "cover";
                            fotoDiv.style.backgroundPosition = "center";
                        }
                    }
                }
            })
            .catch(err => {
                console.error("Erro na verificação:", err);
                window.location.href = "login.html";
            });
    });

    // Lógica do Dropdown (Seta para baixo)
    const userIcon = document.querySelector('.useri');
    const userInfs = document.querySelector('.user-infs');
    if(userIcon) {
        userIcon.addEventListener('click', () => {
            userInfs.classList.toggle('active');
        });
    }

// ===== FUNÇÕES PARA EDIÇÃO DE PERFIL =====

// Variáveis globais para o ajuste de imagem
let imgAjuste = {
    transformX: 0,
    transformY: 0,
    zoom: 1,
    isDragging: false,
    startX: 0,
    startY: 0,
    tipo: '' // 'perfil' ou 'banner'
};

function abrirEdicao() {
    const modal = document.getElementById("modal-editar");
    if (modal) {
        modal.style.display = "flex";
        
        // Preenche os campos com dados atuais
        fetch("/usuario-logado")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.usuario) {
                    const usuario = data.usuario;
                    document.getElementById("edit-nome").value = usuario.nome || '';
                    document.getElementById("edit-endereco").value = usuario.endereco || '';
                }
            })
            .catch(err => console.error("Erro ao carregar dados:", err));
    }
}

function fecharEdicao() {
    const modal = document.getElementById("modal-editar");
    if (modal) {
        modal.style.display = "none";
    }
}

function iniciarAjuste(input, tipo) {
    if (!input.files || !input.files[0]) {
        return;
    }

    imgAjuste.tipo = tipo;
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const img = document.getElementById("img-ajuste");
        img.src = e.target.result;
        
        // Reseta valores de ajuste
        imgAjuste.transformX = 0;
        imgAjuste.transformY = 0;
        imgAjuste.zoom = 1;
        
        document.getElementById("zoom-range").value = 1;
        
        const titulo = tipo === 'perfil' ? 'Ajuste sua Foto de Perfil' : 'Ajuste seu Banner';
        document.getElementById("titulo-ajuste").innerText = titulo;
        
        // Abre o modal
        const modalAjuste = document.getElementById("modal-ajuste");
        if (modalAjuste) {
            modalAjuste.style.display = "flex";
        }
        
        // Configurar eventos de arrastar
        img.onmousedown = (evt) => {
            imgAjuste.isDragging = true;
            imgAjuste.startX = evt.clientX - imgAjuste.transformX;
            imgAjuste.startY = evt.clientY - imgAjuste.transformY;
            img.style.cursor = "grabbing";
        };

        document.onmousemove = (evt) => {
            if (imgAjuste.isDragging) {
                imgAjuste.transformX = evt.clientX - imgAjuste.startX;
                imgAjuste.transformY = evt.clientY - imgAjuste.startY;
                atualizarTransformacao();
            }
        };

        document.onmouseup = () => {
            imgAjuste.isDragging = false;
            img.style.cursor = "move";
        };

        // Slider de zoom
        const zoomRange = document.getElementById("zoom-range");
        if (zoomRange) {
            zoomRange.oninput = (evt) => {
                imgAjuste.zoom = parseFloat(evt.target.value);
                atualizarTransformacao();
            };
        }
    };
    
    reader.readAsDataURL(input.files[0]);
}

function atualizarTransformacao() {
    const img = document.getElementById("img-ajuste");
    if (img) {
        img.style.transform = `translate(${imgAjuste.transformX}px, ${imgAjuste.transformY}px) scale(${imgAjuste.zoom})`;
    }
}

function confirmarAjuste() {
    // Não precisa fazer nada aqui - o formulário já tem o input de arquivo
    // Apenas fecha o modal
    const modalAjuste = document.getElementById("modal-ajuste");
    if (modalAjuste) {
        modalAjuste.style.display = "none";
    }
}

// Fechar modais ao clicar no X
document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.querySelector(".close");
    if (closeBtn) {
        closeBtn.addEventListener("click", fecharEdicao);
    }
});
