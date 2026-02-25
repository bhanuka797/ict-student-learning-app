import { loginWithRole, observeAuth, logout } from './auth.js';
import { auth, db } from './firebase-config.js';
import { doc, getDoc, collection, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { isAccessActive, paymentBadge } from './access.js';

const page = document.body.dataset.page;

function setMessage(msg, type = 'danger') {
  const el = document.getElementById('message');
  if (!el) return;
  el.textContent = msg;
  el.className = `badge ${type}`;
}

if (page === 'login') {
  const form = document.getElementById('loginForm');
  const roleInput = document.getElementById('role');
  const studentIdWrap = document.getElementById('studentIdWrap');
  const emailWrap = document.getElementById('emailWrap');

  roleInput.addEventListener('change', () => {
    const isStudent = roleInput.value === 'student';
    studentIdWrap.style.display = isStudent ? 'block' : 'none';
    emailWrap.style.display = isStudent ? 'none' : 'block';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const role = formData.get('role');
      const result = await loginWithRole({
        role,
        studentId: formData.get('studentId'),
        email: formData.get('email'),
        password: formData.get('password')
      });

      sessionStorage.setItem('role', role);
      sessionStorage.setItem('profile', JSON.stringify(result.profile));
      window.location.href = role === 'student' ? '/dashboard.html' : '/admin/index.html';
    } catch (error) {
      setMessage(error.message || 'Login failed.');
    }
  });
}

if (page === 'dashboard') {
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', async () => {
    await logout();
    sessionStorage.clear();
    window.location.href = '/index.html';
  });

  observeAuth(async (user) => {
    if (!user) {
      window.location.href = '/index.html';
      return;
    }
    const studentDoc = await getDoc(doc(db, 'students', user.uid));
    if (!studentDoc.exists()) {
      setMessage('Student profile missing.', 'danger');
      return;
    }

    const student = studentDoc.data();
    const active = isAccessActive(student.AccessEndDate);
    const badge = paymentBadge(student.PaymentStatus, student.AccessEndDate);

    document.getElementById('welcome').textContent = `Welcome, ${student.Name} (Grade ${student.Grade})`;
    document.getElementById('paymentStatus').innerHTML = `<span class="badge ${badge.className}">${badge.label}</span>`;
    document.getElementById('progressFill').style.width = `${student.ProgressPercent || 35}%`;
    document.getElementById('progressText').textContent = `${student.ProgressPercent || 35}% completed`;

    document.getElementById('freeLink').href = `/grades/grade${student.Grade}/free.html`;
    const premiumLink = document.getElementById('premiumLink');
    premiumLink.href = `/grades/grade${student.Grade}/premium.html`;

    if (!active || student.PaymentStatus !== 'Paid') {
      premiumLink.classList.add('secondary');
      premiumLink.textContent = '🔒 Premium Locked';
      document.getElementById('renewalNotice').style.display = 'block';
    }
  });
}

if (page === 'admin') {
  const logoutBtn = document.getElementById('logoutBtn');
  const filter = document.getElementById('statusFilter');
  logoutBtn?.addEventListener('click', async () => {
    await logout();
    sessionStorage.clear();
    window.location.href = '/index.html';
  });

  async function renderTable() {
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';
    const snap = await getDocs(collection(db, 'students'));
    const selected = filter.value;

    snap.forEach((studentDoc) => {
      const s = studentDoc.data();
      const active = isAccessActive(s.AccessEndDate);
      const visibilityPass = selected === 'all' || (selected === 'active' && active) || (selected === 'expired' && !active);
      if (!visibilityPass) return;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.StudentID}</td>
        <td>${s.Name}</td>
        <td>${s.Grade}</td>
        <td>${s.Phone || '-'}</td>
        <td>
          <select data-field="PaymentStatus">
            <option ${s.PaymentStatus === 'Free' ? 'selected' : ''}>Free</option>
            <option ${s.PaymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
            <option ${s.PaymentStatus === 'Expired' ? 'selected' : ''}>Expired</option>
          </select>
        </td>
        <td><input type="date" data-field="AccessStartDate" value="${s.AccessStartDate || ''}" /></td>
        <td><input type="date" data-field="AccessEndDate" value="${s.AccessEndDate || ''}" /></td>
        <td><button data-id="${studentDoc.id}" class="saveBtn">Save</button></td>
      `;
      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll('.saveBtn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const row = btn.closest('tr');
        const values = [...row.querySelectorAll('[data-field]')].reduce((acc, el) => {
          acc[el.dataset.field] = el.value;
          return acc;
        }, {});
        await updateDoc(doc(db, 'students', btn.dataset.id), values);
        setMessage('Student access updated successfully.', 'success');
      });
    });
  }

  observeAuth(async (user) => {
    if (!user) {
      window.location.href = '/index.html';
      return;
    }

    const adminSnap = await getDoc(doc(db, 'admins', user.uid));
    if (!adminSnap.exists() || adminSnap.data().role !== 'teacher') {
      setMessage('Unauthorized access.', 'danger');
      return;
    }

    filter.addEventListener('change', renderTable);
    await renderTable();
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(console.error);
  });
}
