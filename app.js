

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    initOrderRowSelection();
});


// DASHBOARD INITIALIZATION


function initDashboard() {
    const salesChartEl = document.getElementById('salesChart');
    if (salesChartEl) {
        initSalesChart(salesChartEl);
    }

    updateKPIs();
    updateStockAlerts();
}


// CHARTS


function initSalesChart(canvas) {
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: VENTES_SEMAINE.labels,
            datasets: [
                {
                    label: 'Pommes',
                    data: VENTES_SEMAINE.datasets.pommes,
                    backgroundColor: '#E53935',
                    borderRadius: 4
                },
                {
                    label: 'Poires',
                    data: VENTES_SEMAINE.datasets.poires,
                    backgroundColor: '#8BC34A',
                    borderRadius: 4
                },
                {
                    label: 'Paniers de fruits',
                    data: VENTES_SEMAINE.datasets.paniers,
                    backgroundColor: '#FF9800',
                    borderRadius: 4
                },
                {
                    label: 'Salades',
                    data: VENTES_SEMAINE.datasets.salades,
                    backgroundColor: '#4CAF50',
                    borderRadius: 4
                },
                {
                    label: 'Tomates',
                    data: VENTES_SEMAINE.datasets.tomates,
                    backgroundColor: '#F44336',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: '#f0f0f0'
                    }
                }
            }
        }
    });
}

function initChannelChart(canvas) {
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Kiosque', 'Marchés'],
            datasets: [{
                data: [62, 38],
                backgroundColor: ['#4CAF50', '#FF9800'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function initWeeklyTrendChart(canvas) {
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{
                label: 'CA (€)',
                data: [285, 320, 250, 380, 420, 650, 545],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        callback: function(value) {
                            return '€' + value;
                        }
                    }
                }
            }
        }
    });
}


// KPIs mise àç jour


function updateKPIs() {
    const caEl = document.getElementById('ca-today');
    const ordersEl = document.getElementById('orders-pending');
    const lowStockEl = document.getElementById('low-stock');
    const totalStockEl = document.getElementById('total-stock');

    if (caEl) caEl.textContent = '€' + KPI.caAujourdhui.toFixed(2);
    if (ordersEl) ordersEl.textContent = KPI.commandesAPreparer;
    if (lowStockEl) lowStockEl.textContent = getProduitsEnAlerte().length;
    if (totalStockEl) totalStockEl.textContent = calculerStockTotal();
}


// STOCK ALERTS


function updateStockAlerts() {
    const alertsEl = document.getElementById('stock-alerts');
    if (!alertsEl) return;

    const alertes = getProduitsEnAlerte();
    alertes.sort((a, b) => a.stock - b.stock);

    alertsEl.innerHTML = alertes.map(p => {
        const dotClass = p.stock <= p.seuilCritique * 0.5 ? 'red' :
                        p.stock <= p.seuilCritique * 0.75 ? 'orange' : 'yellow';
        return `
            <li>
                <span class="product-dot ${dotClass}"></span>
                ${p.nom}
                <span class="stock-qty">${p.stock} ${p.unite}</span>
            </li>
        `;
    }).join('');
}


// ORDER ROW SELECTION


function initOrderRowSelection() {
    const rows = document.querySelectorAll('.order-row');
    const clientPanel = document.getElementById('client-panel');

    rows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove selection from all rows
            rows.forEach(r => r.classList.remove('selected'));
            // Add selection to clicked row
            this.classList.add('selected');

            // Update client panel
            const clientKey = this.dataset.client;
            updateClientPanel(clientKey);
        });
    });
}

function updateClientPanel(clientKey) {
    const clientsData = {
        martin: {
            nom: "Christophe Martin",
            tel: "06 32 34 56 78",
            email: "christophe.martin@email.fr",
            points: 165
        },
        lefebvre: {
            nom: "Sophie Lefebvre",
            tel: "06 45 67 89 01",
            email: "sophie.lefebvre@email.fr",
            points: 85
        },
        durant: {
            nom: "Marie Durant",
            tel: "06 78 90 12 34",
            email: "marie.durant@email.fr",
            points: 220
        },
        dupont: {
            nom: "Paul Dupont",
            tel: "06 12 34 56 78",
            email: "paul.dupont@email.fr",
            points: 45
        },
        robert: {
            nom: "Émilie Robert",
            tel: "06 98 76 54 32",
            email: "emilie.robert@email.fr",
            points: 130
        }
    };

    const client = clientsData[clientKey];
    if (!client) return;

    const nameEl = document.getElementById('client-name');
    const panel = document.querySelector('.client-info');

    if (nameEl) nameEl.textContent = client.nom;
    if (panel) {
        panel.innerHTML = `
            <div class="client-name">${client.nom}</div>
            <div class="client-detail"><span>📞</span> ${client.tel}</div>
            <div class="client-detail"><span>✉️</span> ${client.email}</div>
            <div class="client-detail"><span>👤</span> <strong>${client.points} points fidélité</strong></div>
        `;
    }
}


// Les notifs ici 


function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


// VENTE FORM HANDLING


function initVenteForm() {
    const form = document.getElementById('vente-form');
    const produitSelect = document.getElementById('produit');
    const prixInput = document.getElementById('prix');
    const quantiteInput = document.getElementById('quantite');
    const totalSpan = document.getElementById('total-vente');

    if (!form) return;

    // Populate products select
    if (produitSelect) {
        PRODUITS.filter(p => p.actif).forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.nom} (${p.prix.toFixed(2)}€/${p.unite}) - Stock: ${p.stock}`;
            option.dataset.prix = p.prix;
            produitSelect.appendChild(option);
        });

        produitSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption && selectedOption.dataset.prix) {
                prixInput.value = parseFloat(selectedOption.dataset.prix).toFixed(2);
                updateTotal();
            }
        });
    }

    // mise à jour du total
    if (quantiteInput) {
        quantiteInput.addEventListener('input', updateTotal);
    }

    function updateTotal() {
        const prix = parseFloat(prixInput.value) || 0;
        const quantite = parseInt(quantiteInput.value) || 0;
        const total = prix * quantite;
        if (totalSpan) {
            totalSpan.textContent = total.toFixed(2);
        }
    }

    // soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const canal = document.getElementById('canal').value;
        const produitId = parseInt(produitSelect.value);
        const quantite = parseInt(quantiteInput.value);
        const paiement = document.getElementById('paiement').value;

        if (!produitId || !quantite) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }

        const produit = getProduitById(produitId);
        if (produit.stock < quantite) {
            showNotification(`Stock insuffisant! Disponible: ${produit.stock} ${produit.unite}`, 'warning');
            return;
        }

        // Enregistrer la vente
        const vente = enregistrerVente(
            canal,
            null, // pas de client sélectionné
            [{produitId: produitId, quantite: quantite}],
            paiement,
            'Utilisateur'
        );

        showNotification(`Vente #${vente.id} enregistrée! Total: ${vente.total.toFixed(2)}€`, 'success');

        // verifs stock critique
        const updatedProduit = getProduitById(produitId);
        if (updatedProduit.stock <= updatedProduit.seuilCritique) {
            setTimeout(() => {
                showNotification(`⚠️ Alerte: ${updatedProduit.nom} en stock critique (${updatedProduit.stock} ${updatedProduit.unite})`, 'warning');
            }, 1500);
        }

        // Reset form
        form.reset();
        if (totalSpan) totalSpan.textContent = '0.00';

        // Refresh stock display if on stocks page
        if (typeof refreshStockTable === 'function') {
            refreshStockTable();
        }
    });
}


// STOCK TABLE

function initStockTable() {
    refreshStockTable();
}
function refreshStockTable() {
    const tbody = document.getElementById('stock-tbody');
    if (!tbody) return;

    tbody.innerHTML = PRODUITS.filter(p => p.actif).map(p => {
        const statut = getStatutStock(p);
        const statutLabel = getStatutStockLabel(p);
        return `
            <tr>
                <td><strong>${p.nom}</strong></td>
                <td>${p.categorie}</td>
                <td>${p.stock} ${p.unite}</td>
                <td>${p.seuilCritique} ${p.unite}</td>
                <td><span class="stock-status ${statut}">${statutLabel}</span></td>
                <td>${p.prix.toFixed(2)}€</td>
            </tr>
        `;
    }).join('');
}


// ANALYTICS
function initAnalytics() {
    const channelChartEl = document.getElementById('channelChart');
    const trendChartEl = document.getElementById('trendChart');

    if (channelChartEl) {
        initChannelChart(channelChartEl);
    }

    if (trendChartEl) {
        initWeeklyTrendChart(trendChartEl);
    }

    updateAnalyticsKPIs();
    populateTopProducts();
}

function updateAnalyticsKPIs() {
    const elements = {
        'ca-jour': KPI.caAujourdhui,
        'ca-semaine': KPI.caSemaine,
        'ca-mois': KPI.caMois
    };

    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = '€' + value.toFixed(2);
    });
}

function populateTopProducts() {
    const container = document.getElementById('top-products');
    if (!container) return;

    const topProduits = [
        { nom: 'Panier de fruits', ventes: 156, ca: 2340 },
        { nom: 'Pommes', ventes: 245, ca: 857.50 },
        { nom: 'Salades vertes', ventes: 189, ca: 359.10 },
        { nom: 'Tomates', ventes: 134, ca: 603 },
        { nom: 'Jus de pomme', ventes: 98, ca: 441 }
    ];

    container.innerHTML = topProduits.map((p, i) => `
        <li>
            <span class="product-rank">${i + 1}</span>
            <div class="product-info">
                <div class="product-name">${p.nom}</div>
                <div class="product-sales">${p.ventes} ventes</div>
            </div>
            <span class="product-revenue">€${p.ca.toFixed(2)}</span>
        </li>
    `).join('');
}

// Export functions
if (typeof window !== 'undefined') {
    window.showNotification = showNotification;
    window.initVenteForm = initVenteForm;
    window.initStockTable = initStockTable;
    window.refreshStockTable = refreshStockTable;
    window.initAnalytics = initAnalytics;
}
