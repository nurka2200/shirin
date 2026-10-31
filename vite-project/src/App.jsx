import { useState, useEffect, useMemo } from 'react';
import './App.css';
import UIKitGallery from './components/UIKitGallery.jsx';

async function readAuthResponse(response) {
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Не удалось выполнить запрос.');
  return result;
}

// Иконки SVG (Встроенные компоненты для гарантированной работы без внешних библиотек)
const IconSun = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconHeart = ({ filled }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#E53E3E" : "none"} stroke={filled ? "#E53E3E" : "currentColor"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IconCart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IconUser = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconStar = ({ filled }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#ECC94B" : "none"} stroke="#ECC94B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconChat = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconClose = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconMenu = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;

// Словарь переводов (RU, KG, EN)
const TRANSLATIONS = {
  RU: {
    title: "Nomad Eats",
    nav_menu: "Меню",
    nav_booking: "Бронь стола",
    nav_admin: "Админ-панель",
    search_ph: "Поиск блюд...",
    category_all: "Все категории",
    price: "сом",
    add_to_cart: "В корзину",
    cart_title: "Ваш заказ",
    cart_empty: "Корзина пуста",
    total: "Итого:",
    checkout: "Оформить заказ",
    booking_title: "Забронировать стол",
    date: "Дата",
    time: "Время",
    guests: "Количество гостей",
    book_btn: "Забронировать",
    reviews: "Отзывы",
    add_review: "Оставить отзыв",
    admin_title: "Управление меню и Аналитика",
    admin_add: "Добавить блюдо",
    bot_welcome: "Привет! Я NomadBot. Чем могу помочь?",
    bot_placeholder: "Задайте вопрос...",
    wishlist: "Избранное",
    login: "Войти",
    logout: "Выйти",
    role: "Роль",
    admin: "Администратор",
    user: "Пользователь",
  },
  KG: {
    title: "Nomad Eats",
    nav_menu: "Тамактар",
    nav_booking: "Орун ээлөө",
    nav_admin: "Админ баракча",
    search_ph: "Тамактарды издөө...",
    category_all: "Бардыгы",
    price: "сом",
    add_to_cart: "Себетке кошуу",
    cart_title: "Сиздин буйрутмаңыз",
    cart_empty: "Себет бош",
    total: "Жалпы:",
    checkout: "Буйрутма берүү",
    booking_title: "Стол ээлөө",
    date: "Күнү",
    time: "Убактысы",
    guests: "Меймандар саны",
    book_btn: "Ээлөө",
    reviews: "Пикирлер",
    add_review: "Пикир калтыруу",
    admin_title: "Аналитика жана Тамактарды башкаруу",
    admin_add: "Жаңы тамак кошуу",
    bot_welcome: "Салам! Мен NomadBot. Кандай жардам бере алам?",
    bot_placeholder: "Сурооңузду жазыңыз...",
    wishlist: "Тандалгандар",
    login: "Кирүү",
    logout: "Чыгуу",
    role: "Роб",
    admin: "Администратор",
    user: "Колдонуучу",
  },
  EN: {
    title: "Nomad Eats",
    nav_menu: "Menu",
    nav_booking: "Reservation",
    nav_admin: "Admin Panel",
    search_ph: "Search dishes...",
    category_all: "All Categories",
    price: "KGS",
    add_to_cart: "Add to Cart",
    cart_title: "Your Cart",
    cart_empty: "Cart is empty",
    total: "Total:",
    checkout: "Checkout",
    booking_title: "Book a Table",
    date: "Date",
    time: "Time",
    guests: "Guests",
    book_btn: "Book Now",
    reviews: "Reviews",
    add_review: "Write Review",
    admin_title: "Management & Analytics",
    admin_add: "Add Dish",
    bot_welcome: "Hi! I am NomadBot. How can I help you?",
    bot_placeholder: "Ask a question...",
    wishlist: "Favorites",
    login: "Login",
    logout: "Logout",
    role: "Role",
    admin: "Administrator",
    user: "User",
  }
};

// Моковые начальные данные (на случай сбоя API)
const INITIAL_DISHES = [
  { id: '101', name: 'Бешбармак по-нарынски', category: 'Национальная', price: 450, rating: 5, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', description: 'Традиционное блюдо из свежей конины и домашней лапши.' },
  { id: '102', name: 'Лагман Уйгурский', category: 'Национальная', price: 320, rating: 4.8, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', description: 'Тянутая лапша с сочным мясом и овощным соусом Вару.' },
  { id: '103', name: 'Плов Бишкекский', category: 'Национальная', price: 380, rating: 4.9, image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80', description: 'Ароматный плов с бараниной, нутом и изюмом.' },
  { id: '104', name: 'Пицца Пепперони', category: 'Пицца', price: 550, rating: 4.7, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80', description: 'Классическая пицца со стянутым сыром моцарелла и острой пикантной колбасой.' },
  { id: '105', name: 'Бургер Nomad Double', category: 'Бургеры', price: 420, rating: 4.6, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', description: 'Сочная двойная котлета из мраморной говядины с соусом BBQ.' },
  { id: '106', name: 'Классический Чизкейк', category: 'Десерты', price: 250, rating: 4.9, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80', description: 'Нежный творожный десерт с ягодами.' }
];

export default function App() {
  // --- Состояния приложения ---
  const [lang, setLang] = useState('RU');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('menu'); // menu, booking, admin
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null); // Modal detail
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Авторизация / Пользователь
  const [user, setUser] = useState({ name: 'Гость', role: 'User', isLoggedIn: false });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authChecking, setAuthChecking] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Отзывы
  const [reviews, setReviews] = useState([
    { id: 1, dishId: '101', name: 'Алмаз', rating: 5, comment: 'Отличный бешбармак! Мясо очень нежное.' },
    { id: 2, dishId: '102', name: 'Елена', rating: 5, comment: 'Очень сытный и вкусный лагман.' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  // Чат-бот
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: TRANSLATIONS[lang].bot_welcome }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Формы админки
  const [newDish, setNewDish] = useState({ name: '', category: 'Национальная', price: '', image: '', description: '' });

  // Форма заказа
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', address: '', telegram: '' });
  const [checkoutStep, setCheckoutStep] = useState(false);

  const t = TRANSLATIONS[lang];

  // --- Переключение темы ---
  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then(async response => {
        if (response.status === 401) return null;
        const result = await readAuthResponse(response);
        return result.user;
      })
      .then(authenticatedUser => {
        if (cancelled) return;
        if (authenticatedUser) setUser({ ...authenticatedUser, isLoggedIn: true });
        setAuthChecking(false);
      })
      .catch(error => {
        if (cancelled) return;
        setAuthError(`Сервер авторизации недоступен: ${error.message}`);
        setAuthChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Fetch данных из TheMealDB API ---
  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=a')
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          const apiDishes = data.meals.slice(0, 12).map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory || 'Разное',
            price: Math.floor(Math.random() * 300) + 200,
            rating: (Math.random() * 1 + 4).toFixed(1),
            image: meal.strMealThumb,
            description: meal.strInstructions ? meal.strInstructions.slice(0, 100) + '...' : 'Вкуснейшее блюдо от нашего шеф-повара.'
          }));
          const combined = [...INITIAL_DISHES, ...apiDishes];
          setDishes(combined);

          const cats = ['All', ...new Set(combined.map(d => d.category))];
          setCategories(cats);
        } else {
          setDishes(INITIAL_DISHES);
        }
      })
      .catch(() => setDishes(INITIAL_DISHES))
      .finally(() => setLoading(false));
  }, []);

  // --- Логика фильтрации и пагинации ---
  const filteredDishes = useMemo(() => {
    return dishes.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === 'All' || item.category === category;
      return matchesSearch && matchesCat;
    });
  }, [dishes, search, category]);

  const paginatedDishes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDishes.slice(start, start + itemsPerPage);
  }, [filteredDishes, currentPage]);

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);

  // --- Функции Корзины и Wishlist ---
  const addToCart = (dish) => {
    setCart(prev => {
      const exist = prev.find(item => item.id === dish.id);
      if (exist) {
        return prev.map(item => item.id === dish.id ? { ...item, count: item.count + 1 } : item);
      }
      return [...prev, { ...dish, count: 1 }];
    });
  };

  const updateCartCount = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newCount = item.count + delta;
        return newCount > 0 ? { ...item, count: newCount } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.count, 0);

  // --- Симуляция заказа / Telegram / Email ---
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    alert(`🎉 Заказ успешно оформлен!\n\nИмя: ${checkoutData.name}\nСумма: ${totalCartPrice} ${t.price}\n\n📲 Симуляция: Уведомление отправлено в Telegram-бот и на Ваш Email!`);
    setCart([]);
    setCheckoutStep(false);
    setIsCartOpen(false);
  };

  // --- Симуляция Чат-бота ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      let botReply = "Спасибо за вопрос! Наш оператор свяжется с вами в течение 2 минут.";
      const lower = chatInput.toLowerCase();
      if (lower.includes('доставк') || lower.includes('время')) botReply = "Доставка по Бишкеку занимает от 30 до 45 минут!";
      if (lower.includes('оплат') || lower.includes('карты')) botReply = "Вы можете оплатить наличными, Elsom, MBank или картой онлайн.";
      if (lower.includes('скидк') || lower.includes('промо')) botReply = "Используйте промокод NOMAD2026 для скидки 10%!";

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 800);
  };

  // --- Админка CRUD ---
  const handleAddDish = (e) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) return;
    const dishObj = {
      ...newDish,
      id: Date.now().toString(),
      price: Number(newDish.price),
      rating: 5,
      image: newDish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    };
    setDishes([dishObj, ...dishes]);
    setNewDish({ name: '', category: 'Национальная', price: '', image: '', description: '' });
    alert('Блюдо успешно добавлено!');
  };

  const handleDeleteDish = (id) => {
    setDishes(dishes.filter(d => d.id !== id));
  };

  // --- Отзывы ---
  const handleAddReview = (dishId) => {
    if (!newComment.trim()) return;
    setReviews([...reviews, { id: Date.now(), dishId, name: user.name, rating: newRating, comment: newComment }]);
    setNewComment('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      const isRegistration = authMode === 'register';
      const response = await fetch(`/api/auth/${isRegistration ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegistration ? authForm : { email: authForm.email, password: authForm.password }),
      });
      const result = await readAuthResponse(response);
      setUser({ ...result.user, isLoggedIn: true });
      setAuthForm({ name: '', email: '', password: '' });
      setShowAuthModal(false);
      setActiveTab('menu');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setAuthError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      await readAuthResponse(response);
      setUser({ name: 'Гость', role: 'User', isLoggedIn: false });
      setActiveTab('menu');
      setShowAuthModal(false);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <div className="app-container">
      {/* 1. Header / Navbar */}
      <header className="navbar">
        <div className="logo" onClick={() => setActiveTab('menu')}>
          🍲 <span>{t.title}</span>
        </div>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button className={activeTab === 'menu' ? 'active' : ''} onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}>{t.nav_menu}</button>
          <button className={activeTab === 'booking' ? 'active' : ''} onClick={() => { setActiveTab('booking'); setMobileMenuOpen(false); }}>{t.nav_booking}</button>
          <button className={activeTab === 'components' ? 'active' : ''} onClick={() => { setActiveTab('components'); setMobileMenuOpen(false); }}>Компоненты</button>
          {user.role === 'Admin' && (
            <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}>{t.nav_admin}</button>
          )}
        </nav>

        <div className="nav-controls">
          {/* Языковой селектор */}
          <select value={lang} onChange={e => setLang(e.target.value)} className="lang-select">
            <option value="RU">RU</option>
            <option value="KG">KG</option>
            <option value="EN">EN</option>
          </select>

          {/* Переключатель темы */}
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>

          {/* Авторизация */}
          <button className="auth-btn" disabled={authChecking} onClick={() => { setAuthError(''); setShowAuthModal(true); }}>
            <IconUser /> {user.isLoggedIn ? `${user.name} (${user.role})` : t.login}
          </button>

          {/* Корзина */}
          <button className="icon-btn cart-badge-btn" onClick={() => setIsCartOpen(true)}>
            <IconCart />
            {cart.length > 0 && <span className="badge">{cart.reduce((a, b) => a + b.count, 0)}</span>}
          </button>

          {/* Мобильный бургер */}
          <button className="icon-btn burger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <IconMenu />
          </button>
        </div>
      </header>

      {/* 2. Главный Контент по табам */}
      <main className="main-content">
        {/* --- ТАБ 1: КАТАЛОГ И МЕНЮ --- */}
        {activeTab === 'menu' && (
          <section className="menu-section">
            {/* Баннер Перфоманса */}
            <div className="hero-banner">
              <h2>Аутентичная кухня и супер быстрая доставка! 🚀</h2>
              <p>Закажите лучшие национальные и европейские блюда в Бишкеке</p>
            </div>

            {/* Фильтры и Поиск */}
            <div className="filter-bar">
              <input 
                type="text" 
                placeholder={t.search_ph} 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="search-input"
              />
              <div className="category-scroll">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    className={`cat-btn ${category === cat ? 'active' : ''}`}
                    onClick={() => { setCategory(cat); setCurrentPage(1); }}
                  >
                    {cat === 'All' ? t.category_all : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Скелетоны при загрузке */}
            {loading ? (
              <div className="grid-catalog">
                {[1,2,3,4,5,6].map(n => (
                  <div key={n} className="card skeleton-card">
                    <div className="skeleton-img"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                ))}
              </div>
            ) : (
              /* Сетка Товаров */
              <div className="grid-catalog">
                {paginatedDishes.map(dish => (
                  <div key={dish.id} className="card dish-card">
                    <button className="wishlist-btn" onClick={() => toggleWishlist(dish.id)}>
                      <IconHeart filled={wishlist.includes(dish.id)} />
                    </button>
                    <img src={dish.image} alt={dish.name} onClick={() => setSelectedDish(dish)} />
                    <div className="card-body">
                      <div className="card-header-flex">
                        <span className="dish-cat">{dish.category}</span>
                        <span className="dish-rating"><IconStar filled={true} /> {dish.rating}</span>
                      </div>
                      <h3 onClick={() => setSelectedDish(dish)}>{dish.name}</h3>
                      <p className="description-text">{dish.description}</p>
                      <div className="card-footer-flex">
                        <span className="price-tag">{dish.price} {t.price}</span>
                        <button className="btn-primary" onClick={() => addToCart(dish)}>{t.add_to_cart}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page} 
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* --- ТАБ 2: БРОНИРОВАНИЕ СТОЛА --- */}
        {activeTab === 'booking' && (
          <section className="booking-section">
            <div className="booking-card">
              <h2>📅 {t.booking_title}</h2>
              <form onSubmit={(e) => { e.preventDefault(); alert('🎉 Столик успешно забронирован! Вам поступит звонок для подтверждения.'); }}>
                <div className="form-group">
                  <label>{t.date}</label>
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>{t.time}</label>
                  <input type="time" required />
                </div>
                <div className="form-group">
                  <label>{t.guests}</label>
                  <select>
                    <option>1-2 человека</option>
                    <option>3-5 человек</option>
                    <option>Банкет (6+ человек)</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary full-width">{t.book_btn}</button>
              </form>
            </div>
          </section>
        )}

        {/* --- ТАБ 3: АДМИН-ПАНЕЛЬ (CRUD & Analytics) --- */}
        {activeTab === 'admin' && user.isLoggedIn && user.role === 'Admin' && (
          <section className="admin-section">
            <h2>⚙️ {t.admin_title}</h2>
            
            {/* Блок аналитики / Графики */}
            <div className="analytics-grid">
              <div className="stat-card">
                <h4>Общие продажи</h4>
                <p className="stat-num">148,500 сом</p>
                <div className="bar-chart-mock">
                  <div className="bar" style={{ height: '40%' }}></div>
                  <div className="bar" style={{ height: '70%' }}></div>
                  <div className="bar" style={{ height: '100%' }}></div>
                  <div className="bar" style={{ height: '60%' }}></div>
                </div>
              </div>
              <div className="stat-card">
                <h4>Заказов за сегодня</h4>
                <p className="stat-num">42 заказа</p>
              </div>
              <div className="stat-card">
                <h4>Популярное блюдо</h4>
                <p className="stat-num">Бешбармак</p>
              </div>
            </div>

            {/* Форма добавления блюда */}
            <div className="admin-add-form">
              <h3>{t.admin_add}</h3>
              <form onSubmit={handleAddDish} className="admin-form-grid">
                <input type="text" placeholder="Название" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} required />
                <input type="number" placeholder="Цена" value={newDish.price} onChange={e => setNewDish({...newDish, price: e.target.value})} required />
                <input type="text" placeholder="Категория" value={newDish.category} onChange={e => setNewDish({...newDish, category: e.target.value})} />
                <input type="text" placeholder="Ссылка на изображение" value={newDish.image} onChange={e => setNewDish({...newDish, image: e.target.value})} />
                <textarea placeholder="Описание" value={newDish.description} onChange={e => setNewDish({...newDish, description: e.target.value})}></textarea>
                <button type="submit" className="btn-primary">{t.admin_add}</button>
              </form>
            </div>

            {/* Таблица Управления CRUD */}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Фото</th>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map(d => (
                  <tr key={d.id}>
                    <td><img src={d.image} alt="" className="table-thumb" /></td>
                    <td>{d.name}</td>
                    <td>{d.category}</td>
                    <td>{d.price} {t.price}</td>
                    <td>
                      <button className="btn-danger" onClick={() => handleDeleteDish(d.id)}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {activeTab === 'components' && <UIKitGallery />}
      </main>

      {/* 3. Модальное окно деталей товара и отзывов */}
      {selectedDish && (
        <div className="modal-overlay" onClick={() => setSelectedDish(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDish(null)}><IconClose /></button>
            <div className="modal-grid">
              <img src={selectedDish.image} alt={selectedDish.name} />
              <div>
                <h2>{selectedDish.name}</h2>
                <p className="modal-price">{selectedDish.price} {t.price}</p>
                <p>{selectedDish.description}</p>
                <button className="btn-primary" onClick={() => { addToCart(selectedDish); setSelectedDish(null); }}>
                  {t.add_to_cart}
                </button>

                {/* Блок Отзывов */}
                <div className="reviews-block">
                  <h4>{t.reviews}</h4>
                  <div className="reviews-list">
                    {reviews.filter(r => r.dishId === selectedDish.id).map(rev => (
                      <div key={rev.id} className="review-item">
                        <strong>{rev.name}</strong> ({rev.rating}★): <p>{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  <div className="add-review-form">
                    <h5>{t.add_review}</h5>
                    <div className="star-select">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} onClick={() => setNewRating(star)} style={{ cursor: 'pointer' }}>
                          <IconStar filled={star <= newRating} />
                        </span>
                      ))}
                    </div>
                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Ваш комментарий..."></textarea>
                    <button className="btn-secondary" onClick={() => handleAddReview(selectedDish.id)}>Отправить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Корзина / Checkout Modal */}
      {isCartOpen && (
        <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>{t.cart_title}</h2>
              <button onClick={() => setIsCartOpen(false)}><IconClose /></button>
            </div>

            {!checkoutStep ? (
              <>
                <div className="cart-items">
                  {cart.length === 0 ? <p className="empty-msg">{t.cart_empty}</p> : cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt="" />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <span>{item.price} {t.price}</span>
                      </div>
                      <div className="counter-controls">
                        <button onClick={() => updateCartCount(item.id, -1)}>-</button>
                        <span>{item.count}</span>
                        <button onClick={() => updateCartCount(item.id, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="cart-footer">
                    <h3>{t.total} {totalCartPrice} {t.price}</h3>
                    <button className="btn-primary full-width" onClick={() => setCheckoutStep(true)}>{t.checkout}</button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="checkout-form">
                <h3>Оформление заказа</h3>
                <input type="text" placeholder="Имя" required value={checkoutData.name} onChange={e => setCheckoutData({...checkoutData, name: e.target.value})} />
                <input type="tel" placeholder="Телефон" required value={checkoutData.phone} onChange={e => setCheckoutData({...checkoutData, phone: e.target.value})} />
                <input type="text" placeholder="Адрес доставки в Бишкеке" required value={checkoutData.address} onChange={e => setCheckoutData({...checkoutData, address: e.target.value})} />
                <input type="text" placeholder="Telegram / Email для чека" value={checkoutData.telegram} onChange={e => setCheckoutData({...checkoutData, telegram: e.target.value})} />
                <button type="submit" className="btn-primary full-width">Оплатить {totalCartPrice} {t.price}</button>
                <button type="button" className="btn-secondary full-width" onClick={() => setCheckoutStep(false)}>Назад</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. Модалка Авторизации */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuthModal(false)}><IconClose /></button>
            <h2>{user.isLoggedIn ? 'Профиль' : 'Вход в аккаунт'}</h2>
            {!user.isLoggedIn ? (
              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    autoComplete="name"
                    minLength={2}
                    maxLength={80}
                    required
                    value={authForm.name}
                    onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                  minLength={authMode === 'register' ? 10 : undefined}
                  maxLength={128}
                  required
                  value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                />
                {authMode === 'register' && <p className="auth-hint">Email должен быть уникальным, пароль — не короче 10 символов. Регистрация создаёт обычный аккаунт.</p>}
                {authError && <p className="auth-error" role="alert">{authError}</p>}
                <button type="submit" className="btn-primary full-width" disabled={authSubmitting}>
                  {authSubmitting ? 'Проверка...' : authMode === 'register' ? 'Создать аккаунт' : 'Войти'}
                </button>
                <button
                  type="button"
                  className="btn-secondary full-width"
                  disabled={authSubmitting}
                  onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                >
                  {authMode === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
                </button>
                <p className="auth-hint">Доступ администратора выдаётся только аккаунту, настроенному владельцем сервера.</p>
              </form>
            ) : (
              <div>
                <p>Вы вошли как: <strong>{user.name}</strong> ({user.email}, {user.role})</p>
                {authError && <p className="auth-error" role="alert">{authError}</p>}
                <button className="btn-danger" onClick={handleLogout}>
                  {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Чат-бот поддержки (Floating) */}
      <div className="chat-widget">
        {!chatOpen ? (
          <button className="chat-trigger-btn" onClick={() => setChatOpen(true)}>
            <IconChat />
          </button>
        ) : (
          <div className="chat-window">
            <div className="chat-header">
              <span>🤖 NomadBot Support</span>
              <button onClick={() => setChatOpen(false)}><IconClose /></button>
            </div>
            <div className="chat-body">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-msg ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="chat-footer">
              <input 
                type="text" 
                placeholder={t.bot_placeholder} 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
              />
              <button type="submit">➔</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}