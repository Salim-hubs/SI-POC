


// SYSTÈME DE PERSISTANCE (localStorage)


const STORAGE_KEY = 'verger_du_coin_data';

// Données par défaut (utilisées si aucune donnée sauvegardée)
const DEFAULT_PRODUITS = [
    { id: 1, nom: "Pommes", categorie: "Fruits", unite: "kg", prix: 3.50, seuilCritique: 10, stock: 45, actif: true },
    { id: 2, nom: "Poires", categorie: "Fruits", unite: "kg", prix: 4.00, seuilCritique: 10, stock: 4, actif: true },
    { id: 3, nom: "Salades vertes", categorie: "Légumes", unite: "pièce", prix: 1.90, seuilCritique: 10, stock: 3, actif: true },
    { id: 4, nom: "Tomates", categorie: "Légumes", unite: "kg", prix: 4.50, seuilCritique: 15, stock: 8, actif: true },
    { id: 5, nom: "Carottes", categorie: "Légumes", unite: "kg", prix: 2.50, seuilCritique: 10, stock: 32, actif: true },
    { id: 6, nom: "Courgettes", categorie: "Légumes", unite: "kg", prix: 3.00, seuilCritique: 10, stock: 28, actif: true },
    { id: 7, nom: "Chou-fleur", categorie: "Légumes", unite: "pièce", prix: 3.50, seuilCritique: 5, stock: 2, actif: true },
    { id: 8, nom: "Panier de fruits", categorie: "Paniers", unite: "panier", prix: 15.00, seuilCritique: 5, stock: 18, actif: true },
    { id: 9, nom: "Panier légumes", categorie: "Paniers", unite: "panier", prix: 12.00, seuilCritique: 5, stock: 15, actif: true },
    { id: 10, nom: "Confiture de fraises", categorie: "Transformés", unite: "pot", prix: 5.00, seuilCritique: 10, stock: 6, actif: true },
    { id: 11, nom: "Jus de pomme", categorie: "Transformés", unite: "bouteille", prix: 4.50, seuilCritique: 10, stock: 22, actif: true },
    { id: 12, nom: "Miel", categorie: "Transformés", unite: "pot", prix: 8.00, seuilCritique: 5, stock: 12, actif: true }
];

// Clients fidèles par défaut
const DEFAULT_CLIENTS = [
    {
        id: 1,
        nom: "Martin",
        prenom: "Christophe",
        email: "christophe.martin@email.fr",
        telephone: "06 32 34 56 78",
        pointsFidelite: 165,
        abonnement: true,
        consentementRGPD: true,
        dateInscription: "2024-03-15"
    },
    {
        id: 2,
        nom: "Lefebvre",
        prenom: "Sophie",
        email: "sophie.lefebvre@email.fr",
        telephone: "06 45 67 89 01",
        pointsFidelite: 85,
        abonnement: false,
        consentementRGPD: true,
        dateInscription: "2024-06-20"
    },
    {
        id: 3,
        nom: "Durant",
        prenom: "Marie",
        email: "marie.durant@email.fr",
        telephone: "06 78 90 12 34",
        pointsFidelite: 220,
        abonnement: true,
        consentementRGPD: true,
        dateInscription: "2023-11-10"
    },
    {
        id: 4,
        nom: "Dupont",
        prenom: "Paul",
        email: "paul.dupont@email.fr",
        telephone: "06 12 34 56 78",
        pointsFidelite: 45,
        abonnement: false,
        consentementRGPD: true,
        dateInscription: "2025-01-05"
    },
    {
        id: 5,
        nom: "Robert",
        prenom: "Émilie",
        email: "emilie.robert@email.fr",
        telephone: "06 98 76 54 32",
        pointsFidelite: 130,
        abonnement: false,
        consentementRGPD: true,
        dateInscription: "2024-08-12"
    }
];

// Historique des ventes par défaut
const DEFAULT_VENTES = [
    { id: 1036, date: "2026-01-28", canal: "kiosque", clientId: 1, produits: [{produitId: 8, quantite: 1}, {produitId: 10, quantite: 1}], total: 20.00, paiement: "CB", vendeur: "Marc" },
    { id: 1035, date: "2026-01-28", canal: "marché", clientId: 2, produits: [{produitId: 8, quantite: 1}], total: 15.00, paiement: "Espèces", vendeur: "Joshua" },
    { id: 1034, date: "2026-01-27", canal: "kiosque", clientId: 3, produits: [{produitId: 3, quantite: 6}], total: 11.40, paiement: "CB", vendeur: "Lavoine" },
    { id: 1033, date: "2026-01-27", canal: "marché", clientId: 4, produits: [{produitId: 8, quantite: 2}, {produitId: 2, quantite: 1}], total: 23.00, paiement: "Espèces", vendeur: "Joshua" },
    { id: 1032, date: "2026-01-27", canal: "kiosque", clientId: 5, produits: [{produitId: 3, quantite: 1}, {produitId: 4, quantite: 1}], total: 8.00, paiement: "CB", vendeur: "Marc" }
];

// Mouvements de stock par défaut
const DEFAULT_MOUVEMENTS_STOCK = [
    { id: 1, date: "2026-01-28", type: "sortie", produitId: 8, quantite: 1, motif: "Vente #1036", source: "kiosque" },
    { id: 2, date: "2026-01-28", type: "sortie", produitId: 10, quantite: 1, motif: "Vente #1036", source: "kiosque" },
    { id: 3, date: "2026-01-28", type: "sortie", produitId: 8, quantite: 1, motif: "Vente #1035", source: "marché" },
    { id: 4, date: "2026-01-27", type: "entrée", produitId: 1, quantite: 50, motif: "Récolte", source: "production" },
    { id: 5, date: "2026-01-27", type: "entrée", produitId: 3, quantite: 20, motif: "Récolte", source: "production" }
];


// CHARGEMENT DES DONNÉES (localStorage ou défaut)
function loadStoredData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Erreur de lecture localStorage:', e);
    }
    return null;
}

function saveAllData() {
    try {
        const data = {
            produits: PRODUITS,
            clients: CLIENTS,
            ventes: VENTES,
            mouvementsStock: MOUVEMENTS_STOCK,
            commandes: COMMANDES,
            abonnements: ABONNEMENTS,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('Données sauvegardées:', new Date().toLocaleTimeString());
    } catch (e) {
        console.warn('Erreur de sauvegarde localStorage:', e);
    }
}

function resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

// Charger les données sauvegardées ou utiliser les valeurs par défaut
const storedData = loadStoredData();

let PRODUITS = storedData ? storedData.produits : JSON.parse(JSON.stringify(DEFAULT_PRODUITS));
let CLIENTS = storedData ? storedData.clients : JSON.parse(JSON.stringify(DEFAULT_CLIENTS));
let VENTES = storedData ? storedData.ventes : JSON.parse(JSON.stringify(DEFAULT_VENTES));
let MOUVEMENTS_STOCK = storedData ? storedData.mouvementsStock : JSON.parse(JSON.stringify(DEFAULT_MOUVEMENTS_STOCK));

// Afficher le statut de persistance
if (storedData) {
    console.log('Données chargées depuis localStorage (sauvegardées le ' + new Date(storedData.savedAt).toLocaleString('fr-FR') + ')');
} else {
    console.log('Utilisation des données par défaut (première visite)');
}

// COMMANDES CLICK & COLLECT (avec persistance)
const DEFAULT_COMMANDES = [
    { id: 1042, client: 'Marie Durant', tel: '06 78 90 12 34', email: 'marie.durant@email.fr', date: '2026-01-29', canal: 'kiosque', items: [{nom: 'Pommes', qty: 2, prix: 3.50}, {nom: 'Poires', qty: 1, prix: 4.00}, {nom: 'Salades vertes', qty: 2, prix: 1.90}], total: 14.80, status: 'pending', notes: '' },
    { id: 1041, client: 'Sophie Lefebvre', tel: '06 45 67 89 01', email: 'sophie.lefebvre@email.fr', date: '2026-01-29', canal: 'kiosque', items: [{nom: 'Panier de fruits', qty: 1, prix: 15.00}, {nom: 'Confiture de fraises', qty: 1, prix: 5.00}], total: 20.00, status: 'pending', notes: 'Sans bananes SVP' },
    { id: 1040, client: 'Christophe Martin', tel: '06 32 34 56 78', email: 'christophe.martin@email.fr', date: '2026-01-29', canal: 'marche-samedi', items: [{nom: 'Pommes', qty: 3, prix: 3.50}, {nom: 'Tomates', qty: 2, prix: 4.50}], total: 19.50, status: 'ready', notes: '' },
    { id: 1039, client: 'Paul Dupont', tel: '06 12 34 56 78', email: 'paul.dupont@email.fr', date: '2026-01-28', canal: 'kiosque', items: [{nom: 'Jus de pomme', qty: 3, prix: 4.50}], total: 13.50, status: 'completed', notes: '' },
];

const DEFAULT_ABONNEMENTS = [
    { id: 1, client: 'Marie Durant', formule: 'Famille', jour: 'Samedi', lieu: 'Kiosque', preferences: 'Sans oignons', status: 'pending' },
    { id: 2, client: 'Christophe Martin', formule: 'Solo', jour: 'Samedi', lieu: 'Kiosque', preferences: '', status: 'ready' },
];

// Charger commandes et abonnements
let COMMANDES = storedData && storedData.commandes ? storedData.commandes : JSON.parse(JSON.stringify(DEFAULT_COMMANDES));
let ABONNEMENTS = storedData && storedData.abonnements ? storedData.abonnements : JSON.parse(JSON.stringify(DEFAULT_ABONNEMENTS));


// DONNÉES STATIQUES (pas besoin de persistance)
// Données pour les graphiques - Ventes de la semaine
const VENTES_SEMAINE = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: {
        pommes: [45, 52, 38, 65, 48, 95, 72],
        poires: [28, 35, 22, 40, 32, 55, 48],
        paniers: [12, 15, 18, 22, 20, 35, 28],
        salades: [35, 42, 30, 38, 45, 60, 52],
        tomates: [20, 25, 18, 30, 28, 45, 38]
    }
};

// KPIs simulés
const KPI = {
    caAujourdhui: 415.50,
    caHier: 380.20,
    caSemaine: 2850.75,
    caMois: 12450.30,
    commandesAPreparer: 36,
    produitsEnRupture: 5,
    totalStock: 332
};

// Fonctions utilitaires pour la gestion des données
function getProduitById(id) {
    return PRODUITS.find(p => p.id === id);
}

function getClientById(id) {
    return CLIENTS.find(c => c.id === id);
}

function getProduitsEnAlerte() {
    return PRODUITS.filter(p => p.stock <= p.seuilCritique && p.actif);
}

function calculerStockTotal() {
    return PRODUITS.reduce((total, p) => total + p.stock, 0);
}

function enregistrerVente(canal, clientId, produits, paiement, vendeur) {
    const nouvelleVente = {
        id: VENTES.length > 0 ? Math.max(...VENTES.map(v => v.id)) + 1 : 1001,
        date: new Date().toISOString().split('T')[0],
        canal: canal,
        clientId: clientId,
        produits: produits,
        total: produits.reduce((sum, item) => {
            const produit = getProduitById(item.produitId);
            return sum + (produit.prix * item.quantite);
        }, 0),
        paiement: paiement,
        vendeur: vendeur
    };

    // Mise à jour des stocks
    produits.forEach(item => {
        const produit = getProduitById(item.produitId);
        if (produit) {
            produit.stock -= item.quantite;

            // Enregistrer le mouvement de stock
            MOUVEMENTS_STOCK.push({
                id: MOUVEMENTS_STOCK.length + 1,
                date: nouvelleVente.date,
                type: "sortie",
                produitId: item.produitId,
                quantite: item.quantite,
                motif: `Vente #${nouvelleVente.id}`,
                source: canal
            });
        }
    });

    if (clientId) {
        const client = getClientById(clientId);  // Mise à jour des points fidélité client
        if (client) {
            client.pointsFidelite += Math.floor(nouvelleVente.total);
        }
    }

    VENTES.unshift(nouvelleVente);

    //sauv apres chaque vente pour bien garder a jour
    saveAllData();

    return nouvelleVente;
}

function getStatutStock(produit) {
    const ratio = produit.stock / produit.seuilCritique;
    if (ratio <= 0.5) return 'critical';
    if (ratio <= 1) return 'low';
    return 'ok';
}

function getStatutStockLabel(produit) {
    const statut = getStatutStock(produit);
    switch(statut) {
        case 'critical': return 'Critique';
        case 'low': return 'Bas';
        default: return 'OK';
    }
}

// Export pour utilisation dans d'autres fichiers
if (typeof window !== 'undefined') {
    window.PRODUITS = PRODUITS;
    window.CLIENTS = CLIENTS;
    window.VENTES = VENTES;
    window.MOUVEMENTS_STOCK = MOUVEMENTS_STOCK;
    window.COMMANDES = COMMANDES;
    window.ABONNEMENTS = ABONNEMENTS;
    window.VENTES_SEMAINE = VENTES_SEMAINE;
    window.KPI = KPI;
    window.getProduitById = getProduitById;
    window.getClientById = getClientById;
    window.getProduitsEnAlerte = getProduitsEnAlerte;
    window.calculerStockTotal = calculerStockTotal;
    window.enregistrerVente = enregistrerVente;
    window.getStatutStock = getStatutStock;
    window.getStatutStockLabel = getStatutStockLabel;
    // Fonctions de persistance
    window.saveAllData = saveAllData;
    window.resetAllData = resetAllData;
}
