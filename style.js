:root {
    --primary: #1b4332;
    --accent: #52b788;
    --border: #d8f3dc;
    --text-muted: #666;
}

body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
}

header {
    background: var(--primary);
    color: white;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.app-container {
    padding: 12px;
    padding-bottom: 70px;
}

.card {
    background: white;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.form-group {
    margin-bottom: 10px;
}

.form-group label {
    display: block;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 4px;
}

.form-control {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.btn {
    width: 100%;
    padding: 10px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-accent {
    background: var(--accent);
    color: #000;
    font-weight: bold;
}

.btn-outline {
    background: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);
}

.btn-danger {
    background: #d90429;
    color: white;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.product-card {
    background: white;
    border-radius: 6px;
    padding: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.product-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
}

.bottom-nav {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: white;
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    border-top: 1px solid #ddd;
}

.view-section {
    display: none;
}

.view-section.active {
    display: block;
}

.modal-overlay {
    position: fixed;
    top:0; left:0; right:0; bottom:0;
    background: rgba(0,0,0,0.5);
    display: none;
    justify-content: center;
    align-items: center;
}

.modal-overlay.active {
    display: flex;
}

.modal-content {
    background: white;
    padding: 16px;
    border-radius: 8px;
    width: 85%;
    max-width: 400px;
}

.badge-status {
    font-size: 10px;
    background: var(--accent);
    padding: 2px 6px;
    border-radius: 4px;
}

.profile-avatar {
    width: 40px;
    height: 40px;
    background: var(--primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}
