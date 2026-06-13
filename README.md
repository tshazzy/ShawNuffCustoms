# Shawnuff Customs — Website

A static website for Shawnuff Customs metal fabrication and auto shop.

---

## File Structure

```
shawnuff-customs/
├── index.html          ← Main page (everything lives here)
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Navigation, form validation, animations
├── images/             ← Drop your photos here
└── README.md
```

---

## Customizing the Site

### 1. Phone Number & Email
Search `index.html` for these placeholders and replace:
- `(555) 000-0000` → your actual phone number
- `info@shawnuffcustoms.com` → your actual email
- `Your City, State` → your location (or remove if preferred)

### 2. Hours
Find the hours section in the Contact area and update as needed.

### 3. About Section Stats
Find `10+`, `500+`, `100%` in index.html — update to reflect real numbers.

### 4. Adding Photos

**Shop/About photo:**
In `index.html`, find the comment `<!-- Replace this div with an <img> tag when you have a shop photo -->` and replace the whole `<div class="about-img-placeholder">` block with:
```html
<img src="images/shop.jpg" alt="Inside the Shawnuff Customs shop" />
```

**Gallery photos:**
Find the gallery section and replace each `<div class="gallery-item placeholder-img">` block with:
```html
<div class="gallery-item">
  <img src="images/your-photo.jpg" alt="Description of the job" />
</div>
```
Recommended: photos sized at **800×600px** minimum, JPG or WebP format.

---

## Wiring Up the Contact Form (Email Delivery)

The form validates and shows a success message locally, but doesn't send emails yet.
Pick one of these free options to enable real email delivery:

### Option A: Formspree (Easiest — no code)
1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — you'll get an endpoint like `https://formspree.io/f/xyzabcde`
3. In `index.html`, add `action="https://formspree.io/f/YOUR_ID" method="POST"` to the `<form>` tag
4. In `js/main.js`, replace the `submitForm()` function body with a real `fetch()` call:

```javascript
function submitForm() {
  const btn = form.querySelector('.btn-submit');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Sending…';

  const data = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (res.ok) {
      form.style.display = 'none';
      formSuccess.classList.add('visible');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Something went wrong. Please try calling us directly.');
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Send Request';
    }
  })
  .catch(() => {
    alert('Network error. Please try again.');
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Send Request';
  });
}
```

### Option B: Netlify Forms (if deploying to Netlify)
Add `data-netlify="true"` to the `<form>` tag — Netlify handles the rest automatically.

---

## Deployment Guide

### Step 1 — Push to GitHub

1. Download and install [Git for Windows](https://git-scm.com/download/win) if you don't have it
2. Open the folder you downloaded, right-click inside it → **Git Bash Here** (or open a terminal in that folder)
3. Run these commands one at a time:

```bash
git init
git add .
git commit -m "Initial site build"
```

4. Go to [github.com](https://github.com) → New Repository
   - Name it: `shawnuff-customs` (or whatever you want)
   - Set it to **Public**
   - Do NOT check "Add README" (you already have one)
   - Click **Create Repository**

5. GitHub will show you commands — run the ones under "push an existing repository":
```bash
git remote add origin https://github.com/YOUR-USERNAME/shawnuff-customs.git
git branch -M main
git push -u origin main
```

---

### Step 2 — Enable GitHub Pages (free hosting)

1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, choose **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)` → click **Save**
5. After ~2 minutes, your site will be live at:  
   `https://YOUR-USERNAME.github.io/shawnuff-customs`

---

### Step 3 — Connect Your GoDaddy Domain

You bought `shawnuffcustoms.com` (or similar) on GoDaddy. Here's how to point it at GitHub Pages:

#### In GitHub:
1. In your repo → **Settings** → **Pages**
2. Under **Custom domain**, type your domain (e.g. `shawnuffcustoms.com`) and click **Save**
3. GitHub will add a file called `CNAME` to your repo — that's normal

#### In GoDaddy:
1. Log in → **My Products** → find your domain → click **DNS**
2. You'll see a list of DNS records. Make these changes:

**For the root domain (`shawnuffcustoms.com`):**  
Add 4 **A records** pointing to GitHub's IPs. Type = `A`, Name = `@`, TTL = 1 hour:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**For `www` subdomain:**  
Add or edit a **CNAME record**:
- Type: `CNAME`
- Name: `www`
- Value: `YOUR-USERNAME.github.io`
- TTL: 1 hour

3. Save everything. DNS changes take **up to 24–48 hours** to fully propagate, but usually faster.

#### Back in GitHub:
- Once DNS propagates, go back to **Settings → Pages**
- Check **Enforce HTTPS** (this enables the padlock / SSL — free via GitHub)

---

### Making Updates After Deployment

Any time you change a file:
```bash
git add .
git commit -m "Updated phone number" 
git push
```
GitHub Pages will automatically redeploy within ~1–2 minutes.

---

## Quick Checklist Before Going Live

- [ ] Updated phone number and email
- [ ] Updated city/location
- [ ] Added at least one real photo (about section)
- [ ] Added gallery photos (or removed placeholder section)
- [ ] Updated stats to real numbers
- [ ] Wired up form to Formspree or Netlify Forms
- [ ] Tested on mobile (Chrome DevTools → Toggle Device Toolbar)
- [ ] Pushed to GitHub and GitHub Pages is enabled
- [ ] Custom domain connected in GoDaddy DNS
- [ ] HTTPS enforced in GitHub Pages settings
