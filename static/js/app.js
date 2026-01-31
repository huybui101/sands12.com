const openButtons = document.querySelectorAll('[data-open]');
const closeButtons = document.querySelectorAll('[data-close]');

openButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-open');
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  });
});

closeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-close');
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  });
});

const floatingCskh = document.querySelector('.floating-cskh');
if (floatingCskh) {
  let isDragging = false;
  let isPressed = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  let lastDragged = false;
  const dragThreshold = 6;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const onPointerMove = (event) => {
    if (!isPressed) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!isDragging) {
      if (Math.hypot(deltaX, deltaY) < dragThreshold) return;
      isDragging = true;
      lastDragged = true;
      floatingCskh.classList.add('dragging');
    }
    const nextLeft = startLeft + deltaX;
    const nextTop = startTop + deltaY;
    const maxLeft = window.innerWidth - floatingCskh.offsetWidth;
    const maxTop = window.innerHeight - floatingCskh.offsetHeight;
    floatingCskh.style.left = `${clamp(nextLeft, 0, maxLeft)}px`;
    floatingCskh.style.top = `${clamp(nextTop, 0, maxTop)}px`;
    floatingCskh.style.right = 'auto';
    floatingCskh.style.bottom = 'auto';
  };

  const onPointerUp = (event) => {
    if (!isPressed) return;
    isPressed = false;
    if (isDragging) {
      isDragging = false;
      floatingCskh.classList.remove('dragging');
    }
    if (event && typeof event.pointerId === 'number') {
      try {
        floatingCskh.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    window.removeEventListener('blur', onPointerUp);
  };

  floatingCskh.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    isPressed = true;
    lastDragged = false;
    startX = event.clientX;
    startY = event.clientY;
    const rect = floatingCskh.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    try {
      floatingCskh.setPointerCapture(event.pointerId);
    } catch {
      // ignore
    }
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('blur', onPointerUp);
  });

  floatingCskh.addEventListener('click', (event) => {
    if (lastDragged) {
      event.preventDefault();
      event.stopPropagation();
      lastDragged = false;
    }
  });
}

const otpBtn = document.getElementById('otp-btn');
if (otpBtn) {
  otpBtn.addEventListener('click', () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const input = document.getElementById('otp-input');
    if (input) input.value = code;
    otpBtn.textContent = 'Đã gửi';
  });
}
    let betToastTimer = null;
    const showBetToast = (message, isSuccess) => {
      if (!message) return;
      let toast = document.querySelector('.center-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'center-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.toggle('success', !!isSuccess);
      toast.classList.toggle('error', !isSuccess);
      toast.classList.add('active');
      if (betToastTimer) clearTimeout(betToastTimer);
      betToastTimer = setTimeout(() => {
        toast.classList.remove('active');
      }, 1800);
    };

const fontSize = document.getElementById('font-size');
if (fontSize) {
  fontSize.addEventListener('input', (event) => {
    document.documentElement.style.fontSize = `${event.target.value}px`;
    localStorage.setItem('fontSize', event.target.value);
  });

  const stored = localStorage.getItem('fontSize');
  if (stored) {
    fontSize.value = stored;
    document.documentElement.style.fontSize = `${stored}px`;
  }
}

let activeLang = localStorage.getItem('language') || 'vi';
const langSelects = document.querySelectorAll('.language-select, #language-select');
if (langSelects.length) {
  const storedLang = activeLang;
  const translations = {
    vi: {
      login: 'Đăng nhập',
      register: 'Đăng ký',
      logout: 'Đăng xuất',
      logout_admin: 'Đăng xuất hậu đài',
      nav_home: 'Trang chủ',
      nav_casino: 'Casino',
      nav_lottery: 'Xổ số',
      nav_lobby: 'Đại sảnh',
      nav_mine: 'Của tôi',
      settings_title: 'Cài đặt',
      settings_language: 'Ngôn ngữ',
      close: 'Đóng',
      hero_title: 'Marina Bay Sands',
      hero_subtitle: 'Trải nghiệm casino đẳng cấp.',
      hero_explore: 'Khám phá Casino',
      hero_lottery: 'Vào Xổ Số',
      quick_deposit: 'Nạp tiền',
      quick_withdraw: 'Rút số dư',
      quick_bet_history: 'Lịch sử cược',
      quick_online_service: 'Dịch vụ trực tuyến',
      featured_games: 'Trò chơi nổi bật',
      games_per_row: '3 trò / hàng',
      odds_label: 'Odds {low} / {high}',
      section_subtitle: 'Chọn trò chơi để bắt đầu. Thiết kế 5D, hiệu ứng chuyển động sống động.',
      back: '← Trở về',
      back_home: '← Trở về',
      record_no_data: 'Chưa có dữ liệu.',
      status_label: 'Trạng thái',
      updated_label: 'Cập nhật',
      fee_label: 'Phí',
      net_label: 'Thực nhận',
      status_pending: 'Đang chờ',
      status_approved: 'Đã duyệt',
      status_rejected: 'Từ chối',
      time_remaining: 'Thời gian còn',
      rounds_running: 'Số vòng đang quay',
      bet_choices: 'Lựa chọn đặt cược',
      bet_multi_select: 'Có thể chọn nhiều cửa',
      result_label: 'Kết quả',
      system_label: 'Hệ thống',
      result: 'Kết quả',
      waiting_result: 'Đang chờ kết quả...',
      view_bet_history: 'Xem lịch sử cược',
      bet_big: 'Lớn',
      bet_small: 'Nhỏ',
      bet_big_plus: 'Lớn to',
      bet_small_plus: 'Nhỏ bé',
      bet_lottery_big: 'Sổ xố to',
      bet_lottery_small: 'Sổ xố nhỏ',
      bet_animal_big: 'Con to',
      bet_animal_small: 'Con nhỏ',
      bet_hot: 'Nóng',
      bet_cold: 'Lạnh',
      bet_super13: 'Tuyệt 13 cực nổ',
      bet_bao60: 'Báo 60',
      bet_wave_red: 'Làn sóng đỏ',
      bet_wave_blue: 'Làn sóng xanh',
      bet_wave_purple: 'Làn sóng tím',
      bet_wave_yellow: 'Làn sóng vàng',
      selected_count: 'Đã chọn',
      door_label: 'cửa',
      total_formula: 'Tổng tiền = số tiền mỗi cửa × số cửa đã chọn',
      too_many_doors: 'Bạn đã chọn quá nhiều cửa.',
      per_door: 'Mỗi cửa',
      total_amount: 'Tổng tiền',
      net_estimate: 'Ước tính lãi/lỗ',
      bet_history: 'Lịch sử cược',
      bet_history_note: 'Xem chi tiết cược đang chạy và kết quả tại đây.',
      open_history: 'Mở lịch sử',
      bet_amount_title: 'Tiền đặt cược',
      current_balance: 'Số dư hiện tại',
      balance_after: 'Số dư sau cược',
      custom_amount: 'Số tiền tự chọn',
      enter_amount: 'Nhập số tiền',
      max_per_door_hint: 'Chọn cửa để xem tối đa mỗi cửa.',
      max_per_door_prefix: 'Tối đa mỗi cửa',
      place_bet: 'Đặt cược',
      bet_over_balance: 'Tổng cược vượt số dư.',
      bet_over_balance_title: 'Tổng cược vượt số dư hiện tại.',
      bet_err_max_select: 'Chỉ được chọn tối đa 2 cửa.',
      bet_err_min_select: 'Vui lòng chọn ít nhất 1 cửa để đặt cược.',
      bet_err_amount: 'Vui lòng nhập số tiền đặt cược.',
      bet_err_balance: 'Không thành công: Số dư không đủ.',
      bet_err_place_failed: 'Không thể đặt cược.',
      bet_success: 'Đặt cược thành công!',
      bet_placed_template: 'Đã đặt cược {amount}$ - Số dư còn {balance}',
      bet_result_template: 'Kết quả: {outcome} (odds {odds}) - {net}',
      bet_net_win: 'Lãi +{amount}$',
      bet_net_lose: 'Lỗ -{amount}$',
      record_round: 'Vòng',
      record_result: 'KQ',
      record_win: 'Lãi',
      record_lose: 'Lỗ',
      record_pending: 'Đang chờ',
      user_id_label: 'ID',
      admin_title: 'Hậu đài',
      admin_subtitle: 'Quản lý giao diện, logo, banner, trò chơi và tỷ lệ cược.',
      admin_last_update: 'Cập nhật lần cuối',
      admin_menu_home: 'TRANG CHỦ',
      admin_menu_stats: 'THỐNG KÊ',
      admin_menu_users: 'TÀI KHOẢN KHÁCH',
      admin_menu_approval: 'DUYỆT NẠP RÚT',
      admin_menu_banks: 'THÔNG TIN NGÂN HÀNG',
      admin_menu_cskh: 'CSKH ADMIN',
      admin_menu_cskh_config: 'CẤU HÌNH CSKH',
      admin_menu_ads: 'LOGO & QUẢNG CÁO',
      admin_menu_game_images: 'ẢNH TRÒ CHƠI',
      admin_menu_add_game: 'THÊM TRÒ CHƠI',
      admin_menu_theme: 'THAY ĐỔI GIAO DIỆN',
      admin_menu_tips: 'MẸO NHỎ',
      admin_menu_config: 'CÀI CẤU HÌNH',
      admin_menu_fees: 'TÍNH TRI PHÍ NẠP RÚT',
      admin_menu_odds: 'TÙY CHỈNH ODDS',
      admin_general_info: 'Thông tin chung',
      admin_site_name: 'Tên trang web',
      admin_odds_low: 'Odds 1.98',
      admin_odds_high: 'Odds 2.1',
      admin_theme_primary: 'Màu chủ đạo',
      admin_theme_accent: 'Màu nhấn',
      admin_save_info: 'Lưu thông tin',
      admin_logo_banner: 'Logo & Banner',
      admin_logo_site: 'Logo trang web',
      admin_clear_logo: 'Xóa logo',
      admin_hero_images: 'Ảnh quảng cáo (hero)',
      admin_clear_heroes: 'Xóa tất cả hero',
      admin_update_logo_banner: 'Cập nhật logo/banner',
      admin_game_logo: 'Logo trò chơi',
      admin_select_game: 'Chọn trò chơi',
      admin_upload_game_logo: 'Tải logo trò chơi',
      admin_clear_game_logo: 'Xóa logo trò chơi đã chọn',
      admin_delete_image: 'Xóa ảnh',
      admin_update_game_logo: 'Cập nhật logo trò chơi',
      admin_marquee: 'Dòng chạy lợi nhuận',
      admin_marquee_content: 'Nội dung hiển thị',
      admin_save_content: 'Lưu nội dung',
      admin_cskh_config: 'Cấu hình CSKH',
      admin_cskh_logo: 'Logo CSKH',
      admin_clear_cskh_logo: 'Xóa logo CSKH',
      admin_cskh_notice: 'Thông báo trên thanh CSKH',
      admin_cskh_title: 'Tiêu đề CSKH',
      admin_cskh_subtitle: 'Phụ đề CSKH',
      admin_cskh_self_title: 'Tiêu đề tự phục vụ',
      admin_cskh_self_subtitle: 'Phụ đề tự phục vụ',
      admin_cskh_banner_title: 'Tiêu đề banner',
      admin_cskh_banner_desc: 'Mô tả banner',
      admin_cskh_quick_guides: 'Hướng dẫn nhanh (mỗi dòng 1 mục)',
      admin_save_cskh_config: 'Lưu cấu hình CSKH',
      admin_link_home: 'Link trang chủ người dùng',
      admin_link_admin: 'Link hậu đài chỉnh sửa',
      admin_logout: 'Đăng xuất hậu đài',
      admin_preview_title: 'Xem trước giao diện',
      admin_preview_pc: 'Xem PC',
      admin_preview_mobile: 'Xem Mobile',
      admin_preview_note: 'Dùng công cụ responsive của trình duyệt để xem mobile chi tiết.',
      admin_cskh_messages: 'CSKH - Tin nhắn người dùng',
      admin_new: 'Mới',
      admin_reply_placeholder: 'Nhập phản hồi cho khách hàng...',
      admin_no_messages: 'Chưa có tin nhắn CSKH.',
      admin_stats: 'Thống kê',
      admin_stat_users: 'Người dùng',
      admin_stat_balance: 'Tổng số dư',
      admin_stat_games: 'Tổng trò chơi',
      admin_stat_pending: 'Chờ duyệt',
      admin_users: 'Tài khoản khách',
      admin_col_id: 'ID',
      admin_col_name: 'Tên',
      admin_col_balance: 'Số dư',
      admin_col_status: 'Trạng thái',
      admin_col_created: 'Ngày tạo',
      admin_col_actions: 'Thao tác',
      admin_balance_placeholder: 'Số dư',
      admin_update: 'Cập nhật',
      admin_no_users: 'Chưa có người dùng.',
      admin_approval: 'Duyệt nạp/rút',
      admin_tx_type: 'Loại',
      admin_account: 'Tài khoản',
      admin_select_account: 'Chọn tài khoản',
      admin_create_request: 'Tạo yêu cầu',
      admin_col_code: 'Mã',
      admin_col_amount: 'Số tiền',
      admin_approve: 'Duyệt',
      admin_reject: 'Từ chối',
      admin_no_transactions: 'Chưa có giao dịch.',
      admin_bank_info: 'Thông tin ngân hàng',
      admin_bank_transfer_info: 'Thông tin chuyển khoản',
      admin_bank_transfer_placeholder: 'Ví dụ: Ngân hàng: Vietcombank\nChủ TK: Nguyen Van A\nSTK: 123456789\nNội dung: NAP {{ username }}',
      admin_bank_list: 'Danh sách ngân hàng hỗ trợ',
      admin_bank_list_placeholder: 'Ví dụ: Vietcombank, BIDV, Momo',
      admin_save_list: 'Lưu danh sách',
      admin_add_game: 'Thêm trò chơi',
      admin_game_name: 'Tên trò chơi',
      admin_game_name_placeholder: 'Tên trò',
      admin_game_category: 'Phân loại',
      admin_add: 'Thêm',
      admin_tips: 'Mẹo nhỏ',
      admin_tips_content: 'Nội dung mẹo nhỏ',
      admin_tips_placeholder: 'Nhập mẹo hiển thị cho quản trị',
      admin_save_tips: 'Lưu mẹo',
      admin_fees: 'Tính tri phí nạp rút',
      admin_fee_deposit: 'Phí nạp (%)',
      admin_fee_withdraw: 'Phí rút (%)',
      admin_save_fee: 'Lưu phí',
      admin_odds: 'Tùy chỉnh odds theo tài khoản',
      admin_game: 'Trò chơi',
      admin_update_odds: 'Cập nhật odds',
      admin_odds_note: 'Lưu ý: Mỗi tài khoản có thể có odds riêng cho từng trò chơi.',
      upload_avatar: 'Tải avatar',
      please_login: 'Vui lòng đăng nhập trước.',
      total_balance: 'Tổng số tiền',
      income: 'Thu nhập',
      profit_loss: 'Lợi nhuận & thua lỗ',
      deposit: 'Nạp tiền',
      withdraw: 'Rút tiền',
      record_bet_history: 'Lịch sử cược',
      record_deposit_history: 'Hồ sơ nạp tiền',
      record_withdraw_history: 'Hồ sơ rút tiền',
      record_traffic: 'Bản ghi lưu lượng',
      record_account: 'Thông tin tài khoản',
      record_cskh: 'Dịch vụ CSKH',
      record_rebate: 'Bản chi lại',
      record_created: 'Thời gian tạo tài khoản',
      change_language: 'Đổi ngôn ngữ',
      font_size: 'Chỉnh cỡ chữ',
      change_password: 'Đổi mật khẩu',
      change_withdraw_password: 'Đổi mật khẩu rút tiền',
      withdraw_need_bank: 'Bạn chưa liên kết ngân hàng. Vui lòng liên kết để tiếp tục rút tiền.',
      bank_link_title: 'Liên kết ngân hàng',
      full_name: 'Họ và tên',
      phone: 'Số điện thoại',
      bank_account: 'Số tài khoản ngân hàng',
      bank_name: 'Tên ngân hàng',
      bank_notice_1: '1. Tên thật cần trùng khớp với tên thẻ ngân hàng.',
      bank_notice_2: '2. Ngoại trừ tên hiệu, các dữ liệu khác không thể sửa sau khi lưu.',
      save_bank_link: 'Lưu liên kết',
      username_label: 'Tên người dùng',
      withdraw_min: 'Số dư tối thiểu: 100$',
      amount: 'Số tiền',
      withdraw_password_new: 'Mật khẩu rút tiền mới',
      withdraw_password_confirm: 'Nhập lại mật khẩu',
      withdraw_password: 'Mật khẩu rút tiền',
      submit_request: 'Gửi yêu cầu',
      deposit_note: 'Vui lòng nhập số tiền và ghi chú (nếu có).',
      note: 'Ghi chú',
      deposit_placeholder: 'Mã giao dịch / nội dung chuyển',
      bank_transfer_info: 'Thông tin chuyển khoản',
      supported_banks: 'Ngân hàng hỗ trợ',
      change_login_password: 'Đổi mật khẩu đăng nhập',
      new_password: 'Mật khẩu mới',
      update: 'Cập nhật',
      create_withdraw_password: 'Tạo mật khẩu rút tiền',
      create_password: 'Tạo mật khẩu',
      username: 'Tài khoản',
      password: 'Mật khẩu',
      no_account: 'Chưa có tài khoản?',
      have_account: 'Đã có tài khoản?',
      otp: 'Mã xác thực',
      send_code: 'Gửi mã',
      otp_note: 'Mã OTP là dạng demo (6 chữ số).',
      admin_login: 'Đăng nhập hậu đài',
      records_title_bet: 'Lịch sử cược',
      records_title_deposit: 'Nạp tiền',
      records_title_withdraw: 'Rút tiền',
      records_title_account: 'Thông tin tài khoản',
      records_title_created: 'Thời gian tạo tài khoản',
      records_title_traffic: 'Bản ghi lưu lượng',
      records_title_rebate: 'Bản chi lại',
      start_chat: 'Bắt đầu chat',
      quick_guide: 'Hướng dẫn nhanh',
      cskh_welcome: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      image: 'Ảnh',
      enter_message: 'Nhập tin nhắn...',
      send: 'Gửi'
    },
    en: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      logout_admin: 'Admin Logout',
      nav_home: 'Home',
      nav_casino: 'Casino',
      nav_lottery: 'Lottery',
      nav_lobby: 'Lobby',
      nav_mine: 'Me',
      settings_title: 'Settings',
      settings_language: 'Language',
      close: 'Close',
      hero_title: 'Marina Bay Sands',
      hero_subtitle: 'Premium casino experience.',
      hero_explore: 'Explore Casino',
      hero_lottery: 'Go to Lottery',
      quick_deposit: 'Deposit',
      quick_withdraw: 'Withdraw',
      quick_bet_history: 'Bet history',
      quick_online_service: 'Online service',
      featured_games: 'Featured games',
      games_per_row: '3 games / row',
      odds_label: 'Odds {low} / {high}',
      section_subtitle: 'Choose a game to start. 5D design with vivid motion effects.',
      back: '← Back',
      back_home: '← Back',
      record_no_data: 'No data yet.',
      status_label: 'Status',
      updated_label: 'Updated',
      fee_label: 'Fee',
      net_label: 'Net',
      status_pending: 'Pending',
      status_approved: 'Approved',
      status_rejected: 'Rejected',
      time_remaining: 'Time left',
      rounds_running: 'Rounds running',
      bet_choices: 'Bet choices',
      bet_multi_select: 'Multiple selections allowed',
      result_label: 'Result',
      system_label: 'System',
      result: 'Result',
      waiting_result: 'Waiting for result...',
      view_bet_history: 'View bet history',
      bet_big: 'Big',
      bet_small: 'Small',
      bet_big_plus: 'Big+',
      bet_small_plus: 'Small+',
      bet_lottery_big: 'Lottery big',
      bet_lottery_small: 'Lottery small',
      bet_animal_big: 'Animal big',
      bet_animal_small: 'Animal small',
      bet_hot: 'Hot',
      bet_cold: 'Cold',
      bet_super13: 'Super 13',
      bet_bao60: 'Bao 60',
      bet_wave_red: 'Red wave',
      bet_wave_blue: 'Blue wave',
      bet_wave_purple: 'Purple wave',
      bet_wave_yellow: 'Yellow wave',
      selected_count: 'Selected',
      door_label: 'choices',
      total_formula: 'Total = amount per choice × number of choices',
      too_many_doors: 'You selected too many choices.',
      per_door: 'Per choice',
      total_amount: 'Total',
      net_estimate: 'Estimated P/L',
      bet_history: 'Bet history',
      bet_history_note: 'See running bets and results here.',
      open_history: 'Open history',
      bet_amount_title: 'Bet amount',
      current_balance: 'Current balance',
      balance_after: 'Balance after bet',
      custom_amount: 'Custom amount',
      enter_amount: 'Enter amount',
      max_per_door_hint: 'Select choices to see max per choice.',
      max_per_door_prefix: 'Max per choice',
      place_bet: 'Place bet',
      bet_over_balance: 'Total stake exceeds balance.',
      bet_over_balance_title: 'Total stake exceeds current balance.',
      bet_err_max_select: 'You can select up to 2 choices.',
      bet_err_min_select: 'Select at least 1 choice to place a bet.',
      bet_err_amount: 'Enter a bet amount.',
      bet_err_balance: 'Failed: insufficient balance.',
      bet_err_place_failed: 'Unable to place bet.',
      bet_success: 'Bet placed successfully!',
      bet_placed_template: 'Bet placed {amount}$ - Balance left {balance}',
      bet_result_template: 'Result: {outcome} (odds {odds}) - {net}',
      bet_net_win: 'Win +{amount}$',
      bet_net_lose: 'Lose -{amount}$',
      record_round: 'Round',
      record_result: 'Result',
      record_win: 'Win',
      record_lose: 'Lose',
      record_pending: 'Pending',
      user_id_label: 'ID',
      admin_title: 'Admin',
      admin_subtitle: 'Manage UI, logo, banners, games, and odds.',
      admin_last_update: 'Last updated',
      admin_menu_home: 'HOME',
      admin_menu_stats: 'STATS',
      admin_menu_users: 'USERS',
      admin_menu_approval: 'TOP-UP/WITHDRAW',
      admin_menu_banks: 'BANK INFO',
      admin_menu_cskh: 'SUPPORT ADMIN',
      admin_menu_cskh_config: 'SUPPORT CONFIG',
      admin_menu_ads: 'LOGO & ADS',
      admin_menu_game_images: 'GAME IMAGES',
      admin_menu_add_game: 'ADD GAME',
      admin_menu_theme: 'THEME',
      admin_menu_tips: 'TIPS',
      admin_menu_config: 'CONFIG',
      admin_menu_fees: 'FEES',
      admin_menu_odds: 'CUSTOM ODDS',
      admin_general_info: 'General info',
      admin_site_name: 'Site name',
      admin_odds_low: 'Odds 1.98',
      admin_odds_high: 'Odds 2.1',
      admin_theme_primary: 'Primary color',
      admin_theme_accent: 'Accent color',
      admin_save_info: 'Save info',
      admin_logo_banner: 'Logo & Banner',
      admin_logo_site: 'Site logo',
      admin_clear_logo: 'Remove logo',
      admin_hero_images: 'Hero images',
      admin_clear_heroes: 'Remove all heroes',
      admin_update_logo_banner: 'Update logo/banner',
      admin_game_logo: 'Game logo',
      admin_select_game: 'Select game',
      admin_upload_game_logo: 'Upload game logo',
      admin_clear_game_logo: 'Remove selected game logo',
      admin_delete_image: 'Delete image',
      admin_update_game_logo: 'Update game logo',
      admin_marquee: 'Profit ticker',
      admin_marquee_content: 'Display content',
      admin_save_content: 'Save content',
      admin_cskh_config: 'Support config',
      admin_cskh_logo: 'Support logo',
      admin_clear_cskh_logo: 'Remove support logo',
      admin_cskh_notice: 'Support bar notice',
      admin_cskh_title: 'Support title',
      admin_cskh_subtitle: 'Support subtitle',
      admin_cskh_self_title: 'Self-service title',
      admin_cskh_self_subtitle: 'Self-service subtitle',
      admin_cskh_banner_title: 'Banner title',
      admin_cskh_banner_desc: 'Banner description',
      admin_cskh_quick_guides: 'Quick guides (one per line)',
      admin_save_cskh_config: 'Save support config',
      admin_link_home: 'User homepage link',
      admin_link_admin: 'Admin edit link',
      admin_logout: 'Admin logout',
      admin_preview_title: 'UI preview',
      admin_preview_pc: 'View desktop',
      admin_preview_mobile: 'View mobile',
      admin_preview_note: 'Use browser responsive tools to preview mobile.',
      admin_cskh_messages: 'Support - User messages',
      admin_new: 'New',
      admin_reply_placeholder: 'Type a reply to the customer...',
      admin_no_messages: 'No support messages yet.',
      admin_stats: 'Stats',
      admin_stat_users: 'Users',
      admin_stat_balance: 'Total balance',
      admin_stat_games: 'Total games',
      admin_stat_pending: 'Pending',
      admin_users: 'User accounts',
      admin_col_id: 'ID',
      admin_col_name: 'Name',
      admin_col_balance: 'Balance',
      admin_col_status: 'Status',
      admin_col_created: 'Created',
      admin_col_actions: 'Actions',
      admin_balance_placeholder: 'Balance',
      admin_update: 'Update',
      admin_no_users: 'No users yet.',
      admin_approval: 'Top-up/withdraw approvals',
      admin_tx_type: 'Type',
      admin_account: 'Account',
      admin_select_account: 'Select account',
      admin_create_request: 'Create request',
      admin_col_code: 'Code',
      admin_col_amount: 'Amount',
      admin_approve: 'Approve',
      admin_reject: 'Reject',
      admin_no_transactions: 'No transactions yet.',
      admin_bank_info: 'Bank information',
      admin_bank_transfer_info: 'Transfer info',
      admin_bank_transfer_placeholder: 'Example: Bank: Vietcombank\nAccount name: Nguyen Van A\nAccount no: 123456789\nNote: TOPUP {{ username }}',
      admin_bank_list: 'Supported banks list',
      admin_bank_list_placeholder: 'Example: Vietcombank, BIDV, Momo',
      admin_save_list: 'Save list',
      admin_add_game: 'Add game',
      admin_game_name: 'Game name',
      admin_game_name_placeholder: 'Game name',
      admin_game_category: 'Category',
      admin_add: 'Add',
      admin_tips: 'Tips',
      admin_tips_content: 'Tips content',
      admin_tips_placeholder: 'Enter tips for admin',
      admin_save_tips: 'Save tips',
      admin_fees: 'Deposit/withdraw fees',
      admin_fee_deposit: 'Deposit fee (%)',
      admin_fee_withdraw: 'Withdraw fee (%)',
      admin_save_fee: 'Save fees',
      admin_odds: 'Custom odds per account',
      admin_game: 'Game',
      admin_update_odds: 'Update odds',
      admin_odds_note: 'Note: Each account can have custom odds per game.',
      upload_avatar: 'Upload avatar',
      please_login: 'Please log in first.',
      total_balance: 'Total balance',
      income: 'Income',
      profit_loss: 'Profit & loss',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      record_bet_history: 'Bet history',
      record_deposit_history: 'Deposit history',
      record_withdraw_history: 'Withdraw history',
      record_traffic: 'Traffic logs',
      record_account: 'Account info',
      record_cskh: 'Support service',
      record_rebate: 'Rebate logs',
      record_created: 'Account created time',
      change_language: 'Change language',
      font_size: 'Font size',
      change_password: 'Change password',
      change_withdraw_password: 'Change withdraw password',
      withdraw_need_bank: 'You have not linked a bank. Please link a bank to withdraw.',
      bank_link_title: 'Link bank',
      full_name: 'Full name',
      phone: 'Phone number',
      bank_account: 'Bank account',
      bank_name: 'Bank name',
      bank_notice_1: '1. Real name must match the bank account name.',
      bank_notice_2: '2. Except nickname, other data cannot be edited after saving.',
      save_bank_link: 'Save link',
      username_label: 'Username',
      withdraw_min: 'Minimum withdraw: 100$',
      amount: 'Amount',
      withdraw_password_new: 'New withdraw password',
      withdraw_password_confirm: 'Confirm password',
      withdraw_password: 'Withdraw password',
      submit_request: 'Submit request',
      deposit_note: 'Enter amount and note (optional).',
      note: 'Note',
      deposit_placeholder: 'Transaction code / transfer note',
      bank_transfer_info: 'Transfer info',
      supported_banks: 'Supported banks',
      change_login_password: 'Change login password',
      new_password: 'New password',
      update: 'Update',
      create_withdraw_password: 'Create withdraw password',
      create_password: 'Create password',
      username: 'Username',
      password: 'Password',
      no_account: "Don't have an account?",
      have_account: 'Already have an account?',
      otp: 'OTP code',
      send_code: 'Send code',
      otp_note: 'OTP is demo (6 digits).',
      admin_login: 'Admin login',
      records_title_bet: 'Bet history',
      records_title_deposit: 'Deposit',
      records_title_withdraw: 'Withdraw',
      records_title_account: 'Account info',
      records_title_created: 'Account created time',
      records_title_traffic: 'Traffic logs',
      records_title_rebate: 'Rebate logs',
      start_chat: 'Start chat',
      quick_guide: 'Quick guide',
      cskh_welcome: 'Hello! How can I help you?',
      image: 'Image',
      enter_message: 'Enter message...',
      send: 'Send'
    },
    zh: {
      login: '登录',
      register: '注册',
      logout: '退出',
      logout_admin: '后台退出',
      nav_home: '首页',
      nav_casino: '赌场',
      nav_lottery: '彩票',
      nav_lobby: '大厅',
      nav_mine: '我的',
      settings_title: '设置',
      settings_language: '语言',
      close: '关闭',
      hero_title: 'Marina Bay Sands',
      hero_subtitle: '高端赌场体验。',
      hero_explore: '探索赌场',
      hero_lottery: '进入彩票',
      quick_deposit: '充值',
      quick_withdraw: '提现',
      quick_bet_history: '投注记录',
      quick_online_service: '在线服务',
      featured_games: '热门游戏',
      games_per_row: '每行3个',
      odds_label: '赔率 {low} / {high}',
      section_subtitle: '选择游戏开始。5D 设计与动效。',
      back: '← 返回',
      back_home: '← 返回',
      record_no_data: '暂无数据。',
      status_label: '状态',
      updated_label: '更新',
      fee_label: '手续费',
      net_label: '实得',
      status_pending: '待处理',
      status_approved: '已通过',
      status_rejected: '已拒绝',
      time_remaining: '剩余时间',
      rounds_running: '进行中的回合',
      bet_choices: '投注选项',
      bet_multi_select: '可多选',
      result_label: '结果',
      system_label: '系统',
      result: '结果',
      waiting_result: '等待结果…',
      view_bet_history: '查看投注记录',
      bet_big: '大',
      bet_small: '小',
      bet_big_plus: '大大',
      bet_small_plus: '小小',
      bet_lottery_big: '彩票大',
      bet_lottery_small: '彩票小',
      bet_animal_big: '大',
      bet_animal_small: '小',
      bet_hot: '热',
      bet_cold: '冷',
      bet_super13: '超级13',
      bet_bao60: '豹60',
      bet_wave_red: '红色浪潮',
      bet_wave_blue: '蓝色浪潮',
      bet_wave_purple: '紫色浪潮',
      bet_wave_yellow: '黄色浪潮',
      selected_count: '已选择',
      door_label: '项',
      total_formula: '总额 = 每项金额 × 已选项数',
      too_many_doors: '选择项过多。',
      per_door: '每项',
      total_amount: '总额',
      net_estimate: '预计盈亏',
      bet_history: '投注记录',
      bet_history_note: '在此查看进行中与结果。',
      open_history: '打开记录',
      bet_amount_title: '投注金额',
      current_balance: '当前余额',
      balance_after: '投注后余额',
      custom_amount: '自定义金额',
      enter_amount: '输入金额',
      max_per_door_hint: '选择项目以查看每项上限。',
      max_per_door_prefix: '每项上限',
      place_bet: '下注',
      bet_over_balance: '总投注超过余额。',
      bet_over_balance_title: '总投注超过当前余额。',
      bet_err_max_select: '最多只能选择2项。',
      bet_err_min_select: '请至少选择1项下注。',
      bet_err_amount: '请输入下注金额。',
      bet_err_balance: '失败：余额不足。',
      bet_err_place_failed: '无法下注。',
      bet_success: '下注成功！',
      bet_placed_template: '已下注 {amount}$ - 余额 {balance}',
      bet_result_template: '结果：{outcome} (赔率 {odds}) - {net}',
      bet_net_win: '赢 +{amount}$',
      bet_net_lose: '输 -{amount}$',
      upload_avatar: '上传头像',
      please_login: '请先登录。',
      total_balance: '总余额',
      income: '收入',
      profit_loss: '盈亏',
      deposit: '充值',
      withdraw: '提现',
      record_bet_history: '投注记录',
      record_deposit_history: '充值记录',
      record_withdraw_history: '提现记录',
      record_traffic: '流量记录',
      record_account: '账户信息',
      record_cskh: '客服服务',
      record_rebate: '返利记录',
      record_created: '账户创建时间',
      change_language: '切换语言',
      font_size: '字体大小',
      change_password: '修改密码',
      change_withdraw_password: '修改提现密码',
      withdraw_need_bank: '未绑定银行卡，请先绑定。',
      bank_link_title: '绑定银行卡',
      full_name: '姓名',
      phone: '手机号',
      bank_account: '银行卡号',
      bank_name: '银行名称',
      bank_notice_1: '1. 真实姓名需与银行卡一致。',
      bank_notice_2: '2. 保存后除昵称外不可修改。',
      save_bank_link: '保存绑定',
      username_label: '用户名',
      withdraw_min: '最低提现：100$',
      amount: '金额',
      withdraw_password_new: '新提现密码',
      withdraw_password_confirm: '确认密码',
      withdraw_password: '提现密码',
      submit_request: '提交申请',
      deposit_note: '请输入金额及备注（可选）。',
      note: '备注',
      deposit_placeholder: '交易码 / 转账备注',
      bank_transfer_info: '转账信息',
      supported_banks: '支持银行',
      change_login_password: '修改登录密码',
      new_password: '新密码',
      update: '更新',
      create_withdraw_password: '设置提现密码',
      create_password: '创建密码',
      username: '账号',
      password: '密码',
      no_account: '没有账号？',
      have_account: '已有账号？',
      otp: '验证码',
      send_code: '发送验证码',
      otp_note: 'OTP 为演示（6位数字）。',
      admin_login: '后台登录',
      records_title_bet: '投注记录',
      records_title_deposit: '充值',
      records_title_withdraw: '提现',
      records_title_account: '账户信息',
      records_title_created: '账户创建时间',
      records_title_traffic: '流量记录',
      records_title_rebate: '返利记录',
      start_chat: '开始聊天',
      quick_guide: '快速指南',
      cskh_welcome: '您好！我可以帮您什么？',
      image: '图片',
      enter_message: '输入消息…',
      send: '发送'
    },
    ja: {
      login: 'ログイン',
      register: '登録',
      logout: 'ログアウト',
      logout_admin: '管理者ログアウト',
      nav_home: 'ホーム',
      nav_casino: 'カジノ',
      nav_lottery: '宝くじ',
      nav_lobby: 'ロビー',
      nav_mine: 'マイ',
      settings_title: '設定',
      settings_language: '言語',
      close: '閉じる',
      hero_title: 'Marina Bay Sands',
      hero_subtitle: 'プレミアムカジノ体験。',
      hero_explore: 'カジノを探索',
      hero_lottery: '宝くじへ',
      quick_deposit: '入金',
      quick_withdraw: '出金',
      quick_bet_history: 'ベット履歴',
      quick_online_service: 'オンラインサービス',
      featured_games: '注目ゲーム',
      games_per_row: '1行3ゲーム',
      odds_label: 'オッズ {low} / {high}',
      section_subtitle: 'ゲームを選択して開始。5Dデザインと動的効果。',
      back: '← 戻る',
      back_home: '← 戻る',
      record_no_data: 'データなし。',
      status_label: '状態',
      updated_label: '更新',
      fee_label: '手数料',
      net_label: '実受取',
      status_pending: '保留',
      status_approved: '承認済み',
      status_rejected: '拒否',
      time_remaining: '残り時間',
      rounds_running: '進行中ラウンド',
      bet_choices: 'ベット選択',
      bet_multi_select: '複数選択可',
      result: '結果',
      waiting_result: '結果待ち…',
      view_bet_history: 'ベット履歴を見る',
      bet_big: '大',
      bet_small: '小',
      bet_big_plus: '大きい',
      bet_small_plus: '小さい',
      bet_lottery_big: '宝くじ大',
      bet_lottery_small: '宝くじ小',
      bet_animal_big: '大',
      bet_animal_small: '小',
      bet_hot: '熱い',
      bet_cold: '冷たい',
      bet_super13: 'スーパー13',
      bet_bao60: '豹60',
      bet_wave_red: '赤い波',
      bet_wave_blue: '青い波',
      bet_wave_purple: '紫の波',
      bet_wave_yellow: '黄色の波',
      selected_count: '選択済み',
      door_label: '件',
      total_formula: '合計 = 1件あたり × 選択数',
      too_many_doors: '選択が多すぎます。',
      per_door: '1件あたり',
      total_amount: '合計',
      net_estimate: '予想損益',
      bet_history: 'ベット履歴',
      bet_history_note: '進行中と結果を確認。',
      open_history: '履歴を開く',
      bet_amount_title: 'ベット金額',
      current_balance: '現在残高',
      balance_after: 'ベット後残高',
      custom_amount: '任意金額',
      enter_amount: '金額を入力',
      max_per_door_hint: '選択して1件あたり上限を表示。',
      max_per_door_prefix: '1件あたり上限',
      place_bet: 'ベットする',
      bet_over_balance: '合計が残高を超えています。',
      bet_over_balance_title: '合計が現在残高を超えています。',
      bet_err_max_select: '最大2件まで選択できます。',
      bet_err_min_select: '少なくとも1件選択してください。',
      bet_err_amount: '金額を入力してください。',
      bet_err_balance: '失敗：残高不足。',
      bet_err_place_failed: 'ベットできません。',
      bet_success: 'ベット成功！',
      bet_placed_template: 'ベット {amount}$ - 残高 {balance}',
      bet_result_template: '結果: {outcome} (オッズ {odds}) - {net}',
      bet_net_win: '勝ち +{amount}$',
      bet_net_lose: '負け -{amount}$',
      upload_avatar: 'アバターをアップロード',
      please_login: 'ログインしてください。',
      total_balance: '総残高',
      income: '収入',
      profit_loss: '損益',
      deposit: '入金',
      withdraw: '出金',
      record_bet_history: 'ベット履歴',
      record_deposit_history: '入金履歴',
      record_withdraw_history: '出金履歴',
      record_traffic: 'トラフィック記録',
      record_account: 'アカウント情報',
      record_cskh: 'サポートサービス',
      record_rebate: 'リベート記録',
      record_created: 'アカウント作成時間',
      change_language: '言語を変更',
      font_size: 'フォントサイズ',
      change_password: 'パスワード変更',
      change_withdraw_password: '出金パスワード変更',
      withdraw_need_bank: '銀行未連携です。連携してください。',
      bank_link_title: '銀行連携',
      full_name: '氏名',
      phone: '電話番号',
      bank_account: '銀行口座',
      bank_name: '銀行名',
      bank_notice_1: '1. 氏名は銀行名義と一致必要。',
      bank_notice_2: '2. 保存後は変更不可。',
      save_bank_link: '連携を保存',
      username_label: 'ユーザー名',
      withdraw_min: '最低出金：100$',
      amount: '金額',
      withdraw_password_new: '新しい出金パスワード',
      withdraw_password_confirm: 'パスワード確認',
      withdraw_password: '出金パスワード',
      submit_request: '申請送信',
      deposit_note: '金額とメモ（任意）を入力。',
      note: 'メモ',
      deposit_placeholder: '取引コード / 振込メモ',
      bank_transfer_info: '振込情報',
      supported_banks: '対応銀行',
      change_login_password: 'ログインパスワード変更',
      new_password: '新しいパスワード',
      update: '更新',
      create_withdraw_password: '出金パスワード作成',
      create_password: 'パスワード作成',
      username: 'ユーザー名',
      password: 'パスワード',
      no_account: 'アカウントなし？',
      have_account: '既にアカウントあり？',
      otp: '認証コード',
      send_code: 'コード送信',
      otp_note: 'OTPはデモ（6桁）。',
      admin_login: '管理者ログイン',
      records_title_bet: 'ベット履歴',
      records_title_deposit: '入金',
      records_title_withdraw: '出金',
      records_title_account: 'アカウント情報',
      records_title_created: 'アカウント作成時間',
      records_title_traffic: 'トラフィック記録',
      records_title_rebate: 'リベート記録',
      start_chat: 'チャット開始',
      quick_guide: 'クイックガイド',
      cskh_welcome: 'こんにちは！ご用件は？',
      image: '画像',
      enter_message: 'メッセージ入力…',
      send: '送信'
    },
    ko: {
      login: '로그인',
      register: '회원가입',
      logout: '로그아웃',
      logout_admin: '관리자 로그아웃',
      nav_home: '홈',
      nav_casino: '카지노',
      nav_lottery: '복권',
      nav_lobby: '로비',
      nav_mine: '내 정보',
      settings_title: '설정',
      settings_language: '언어',
      close: '닫기',
      hero_title: 'Marina Bay Sands',
      hero_subtitle: '프리미엄 카지노 경험.',
      hero_explore: '카지노 둘러보기',
      hero_lottery: '복권으로 이동',
      quick_deposit: '입금',
      quick_withdraw: '출금',
      quick_bet_history: '베팅 내역',
      quick_online_service: '온라인 서비스',
      featured_games: '추천 게임',
      games_per_row: '한 줄 3개',
      odds_label: '배당 {low} / {high}',
      section_subtitle: '게임을 선택하여 시작하세요. 5D 디자인과 생동감 있는 효과.',
      back: '← 뒤로',
      back_home: '← 뒤로',
      record_no_data: '데이터가 없습니다.',
      status_label: '상태',
      updated_label: '업데이트',
      fee_label: '수수료',
      net_label: '실수령',
      status_pending: '대기',
      status_approved: '승인됨',
      status_rejected: '거절됨',
      time_remaining: '남은 시간',
      rounds_running: '진행 중 라운드',
      bet_choices: '베팅 선택',
      bet_multi_select: '복수 선택 가능',
      result: '결과',
      waiting_result: '결과 대기 중...',
      view_bet_history: '베팅 내역 보기',
      bet_big: '큰',
      bet_small: '작은',
      bet_big_plus: '더 큰',
      bet_small_plus: '더 작은',
      bet_lottery_big: '복권 큰',
      bet_lottery_small: '복권 작은',
      bet_animal_big: '큰',
      bet_animal_small: '작은',
      bet_hot: '뜨거움',
      bet_cold: '차가움',
      bet_super13: '슈퍼 13',
      bet_bao60: '바오 60',
      bet_wave_red: '붉은 파도',
      bet_wave_blue: '푸른 파도',
      bet_wave_purple: '보라 파도',
      bet_wave_yellow: '노란 파도',
      selected_count: '선택됨',
      door_label: '항목',
      total_formula: '총액 = 항목당 금액 × 선택 수',
      too_many_doors: '선택이 너무 많습니다.',
      per_door: '항목당',
      total_amount: '총액',
      net_estimate: '예상 손익',
      bet_history: '베팅 내역',
      bet_history_note: '진행 중 및 결과를 확인하세요.',
      open_history: '내역 열기',
      bet_amount_title: '베팅 금액',
      current_balance: '현재 잔액',
      balance_after: '베팅 후 잔액',
      custom_amount: '직접 입력',
      enter_amount: '금액 입력',
      max_per_door_hint: '선택 후 항목당 최대 표시.',
      max_per_door_prefix: '항목당 최대',
      place_bet: '베팅하기',
      bet_over_balance: '총 베팅이 잔액을 초과했습니다.',
      bet_over_balance_title: '총 베팅이 현재 잔액을 초과했습니다.',
      bet_err_max_select: '최대 2개까지 선택 가능합니다.',
      bet_err_min_select: '최소 1개를 선택하세요.',
      bet_err_amount: '베팅 금액을 입력하세요.',
      bet_err_balance: '실패: 잔액 부족.',
      bet_err_place_failed: '베팅할 수 없습니다.',
      bet_success: '베팅 성공!',
      bet_placed_template: '베팅 {amount}$ - 잔액 {balance}',
      bet_result_template: '결과: {outcome} (배당 {odds}) - {net}',
      bet_net_win: '승 +{amount}$',
      bet_net_lose: '패 -{amount}$',
      upload_avatar: '아바타 업로드',
      please_login: '먼저 로그인하세요.',
      total_balance: '총 잔액',
      income: '수입',
      profit_loss: '손익',
      deposit: '입금',
      withdraw: '출금',
      record_bet_history: '베팅 내역',
      record_deposit_history: '입금 내역',
      record_withdraw_history: '출금 내역',
      record_traffic: '트래픽 기록',
      record_account: '계정 정보',
      record_cskh: '고객 지원',
      record_rebate: '리베이트 기록',
      record_created: '계정 생성 시간',
      change_language: '언어 변경',
      font_size: '글꼴 크기',
      change_password: '비밀번호 변경',
      change_withdraw_password: '출금 비밀번호 변경',
      withdraw_need_bank: '은행이 연결되지 않았습니다. 먼저 연결하세요.',
      bank_link_title: '은행 연결',
      full_name: '이름',
      phone: '전화번호',
      bank_account: '은행 계좌',
      bank_name: '은행명',
      bank_notice_1: '1. 실명은 은행 계좌명과 일치해야 합니다.',
      bank_notice_2: '2. 저장 후에는 수정할 수 없습니다.',
      save_bank_link: '연결 저장',
      username_label: '사용자 이름',
      withdraw_min: '최소 출금: 100$',
      amount: '금액',
      withdraw_password_new: '새 출금 비밀번호',
      withdraw_password_confirm: '비밀번호 확인',
      withdraw_password: '출금 비밀번호',
      submit_request: '요청 제출',
      deposit_note: '금액과 메모(선택)를 입력하세요.',
      note: '메모',
      deposit_placeholder: '거래 코드 / 이체 메모',
      bank_transfer_info: '이체 정보',
      supported_banks: '지원 은행',
      change_login_password: '로그인 비밀번호 변경',
      new_password: '새 비밀번호',
      update: '업데이트',
      create_withdraw_password: '출금 비밀번호 만들기',
      create_password: '비밀번호 만들기',
      username: '아이디',
      password: '비밀번호',
      no_account: '계정이 없으신가요?',
      have_account: '이미 계정이 있나요?',
      otp: '인증 코드',
      send_code: '코드 보내기',
      otp_note: 'OTP는 데모(6자리)입니다.',
      admin_login: '관리자 로그인',
      records_title_bet: '베팅 내역',
      records_title_deposit: '입금',
      records_title_withdraw: '출금',
      records_title_account: '계정 정보',
      records_title_created: '계정 생성 시간',
      records_title_traffic: '트래픽 기록',
      records_title_rebate: '리베이트 기록',
      start_chat: '채팅 시작',
      quick_guide: '빠른 안내',
      cskh_welcome: '안녕하세요! 무엇을 도와드릴까요?',
      image: '이미지',
      enter_message: '메시지 입력...',
      send: '보내기'
    },
    th: {
      login: 'เข้าสู่ระบบ',
      register: 'สมัครสมาชิก',
      logout: 'ออกจากระบบ',
      logout_admin: 'ออกจากหลังบ้าน',
      nav_home: 'หน้าแรก',
      nav_casino: 'คาสิโน',
      nav_lottery: 'ลอตเตอรี่',
      nav_lobby: 'ล็อบบี้',
      nav_mine: 'ของฉัน',
      settings_title: 'ตั้งค่า',
      settings_language: 'ภาษา',
      close: 'ปิด',
      hero_title: 'Marina Bay Sands',
      hero_subtitle: 'ประสบการณ์คาสิโนระดับพรีเมียม',
      hero_explore: 'สำรวจคาสิโน',
      hero_lottery: 'ไปที่ลอตเตอรี่',
      quick_deposit: 'ฝากเงิน',
      quick_withdraw: 'ถอนเงิน',
      quick_bet_history: 'ประวัติการเดิมพัน',
      quick_online_service: 'บริการออนไลน์',
      featured_games: 'เกมแนะนำ',
      games_per_row: '3 เกม/แถว',
      odds_label: 'อัตราต่อรอง {low} / {high}',
      section_subtitle: 'เลือกเกมเพื่อเริ่มต้น ดีไซน์ 5D พร้อมเอฟเฟกต์เคลื่อนไหว',
      back: '← กลับ',
      back_home: '← กลับ',
      record_no_data: 'ไม่มีข้อมูล',
      status_label: 'สถานะ',
      updated_label: 'อัปเดต',
      fee_label: 'ค่าธรรมเนียม',
      net_label: 'รับจริง',
      status_pending: 'รอดำเนินการ',
      status_approved: 'อนุมัติแล้ว',
      status_rejected: 'ปฏิเสธ',
      time_remaining: 'เวลาที่เหลือ',
      rounds_running: 'รอบที่กำลังดำเนินการ',
      bet_choices: 'ตัวเลือกการเดิมพัน',
      bet_multi_select: 'เลือกได้หลายตัว',
      result: 'ผลลัพธ์',
      waiting_result: 'รอผล...',
      view_bet_history: 'ดูประวัติการเดิมพัน',
      bet_big: 'ใหญ่',
      bet_small: 'เล็ก',
      bet_big_plus: 'ใหญ่พิเศษ',
      bet_small_plus: 'เล็กพิเศษ',
      bet_lottery_big: 'ลอตเตอรี่ใหญ่',
      bet_lottery_small: 'ลอตเตอรี่เล็ก',
      bet_animal_big: 'ใหญ่',
      bet_animal_small: 'เล็ก',
      bet_hot: 'ร้อน',
      bet_cold: 'เย็น',
      bet_super13: 'ซูเปอร์ 13',
      bet_bao60: 'เปา 60',
      bet_wave_red: 'คลื่นแดง',
      bet_wave_blue: 'คลื่นน้ำเงิน',
      bet_wave_purple: 'คลื่นม่วง',
      bet_wave_yellow: 'คลื่นเหลือง',
      selected_count: 'เลือกแล้ว',
      door_label: 'รายการ',
      total_formula: 'รวม = เงินต่อรายการ × จำนวนที่เลือก',
      too_many_doors: 'เลือกมากเกินไป',
      per_door: 'ต่อรายการ',
      total_amount: 'รวม',
      net_estimate: 'กำไร/ขาดทุนโดยประมาณ',
      bet_history: 'ประวัติการเดิมพัน',
      bet_history_note: 'ดูเดิมพันที่กำลังดำเนินการและผลลัพธ์ที่นี่',
      open_history: 'เปิดประวัติ',
      bet_amount_title: 'ยอดเดิมพัน',
      current_balance: 'ยอดคงเหลือ',
      balance_after: 'ยอดหลังเดิมพัน',
      custom_amount: 'กำหนดจำนวนเอง',
      enter_amount: 'ใส่จำนวนเงิน',
      max_per_door_hint: 'เลือกเพื่อดูสูงสุดต่อรายการ',
      max_per_door_prefix: 'สูงสุดต่อรายการ',
      place_bet: 'วางเดิมพัน',
      bet_over_balance: 'ยอดเดิมพันเกินยอดคงเหลือ',
      bet_over_balance_title: 'ยอดเดิมพันเกินยอดคงเหลือปัจจุบัน',
      bet_err_max_select: 'เลือกได้สูงสุด 2 รายการ',
      bet_err_min_select: 'กรุณาเลือกอย่างน้อย 1 รายการ',
      bet_err_amount: 'กรุณาใส่จำนวนเงินเดิมพัน',
      bet_err_balance: 'ล้มเหลว: ยอดคงเหลือไม่พอ',
      bet_err_place_failed: 'ไม่สามารถวางเดิมพันได้',
      bet_success: 'วางเดิมพันสำเร็จ!',
      bet_placed_template: 'วางเดิมพัน {amount}$ - คงเหลือ {balance}',
      bet_result_template: 'ผลลัพธ์: {outcome} (อัตรา {odds}) - {net}',
      bet_net_win: 'กำไร +{amount}$',
      bet_net_lose: 'ขาดทุน -{amount}$',
      upload_avatar: 'อัปโหลดรูป',
      please_login: 'กรุณาเข้าสู่ระบบก่อน',
      total_balance: 'ยอดรวม',
      income: 'รายได้',
      profit_loss: 'กำไร/ขาดทุน',
      deposit: 'ฝากเงิน',
      withdraw: 'ถอนเงิน',
      record_bet_history: 'ประวัติการเดิมพัน',
      record_deposit_history: 'ประวัติฝากเงิน',
      record_withdraw_history: 'ประวัติถอนเงิน',
      record_traffic: 'บันทึกการใช้งาน',
      record_account: 'ข้อมูลบัญชี',
      record_cskh: 'บริการลูกค้า',
      record_rebate: 'บันทึกรีเบต',
      record_created: 'เวลาสร้างบัญชี',
      change_language: 'เปลี่ยนภาษา',
      font_size: 'ขนาดตัวอักษร',
      change_password: 'เปลี่ยนรหัสผ่าน',
      change_withdraw_password: 'เปลี่ยนรหัสถอนเงิน',
      withdraw_need_bank: 'ยังไม่ได้ผูกธนาคาร กรุณาผูกธนาคารก่อน',
      bank_link_title: 'ผูกบัญชีธนาคาร',
      full_name: 'ชื่อ-นามสกุล',
      phone: 'เบอร์โทรศัพท์',
      bank_account: 'เลขบัญชีธนาคาร',
      bank_name: 'ชื่อธนาคาร',
      bank_notice_1: '1. ชื่อจริงต้องตรงกับชื่อในบัญชีธนาคาร',
      bank_notice_2: '2. หลังบันทึกแล้วแก้ไขไม่ได้',
      save_bank_link: 'บันทึกการผูกบัญชี',
      username_label: 'ชื่อผู้ใช้',
      withdraw_min: 'ถอนขั้นต่ำ: 100$',
      amount: 'จำนวนเงิน',
      withdraw_password_new: 'รหัสถอนเงินใหม่',
      withdraw_password_confirm: 'ยืนยันรหัสผ่าน',
      withdraw_password: 'รหัสถอนเงิน',
      submit_request: 'ส่งคำขอ',
      deposit_note: 'กรอกจำนวนเงินและหมายเหตุ (ถ้ามี)',
      note: 'หมายเหตุ',
      deposit_placeholder: 'รหัสธุรกรรม / หมายเหตุโอน',
      bank_transfer_info: 'ข้อมูลการโอน',
      supported_banks: 'ธนาคารที่รองรับ',
      change_login_password: 'เปลี่ยนรหัสผ่านเข้าสู่ระบบ',
      new_password: 'รหัสผ่านใหม่',
      update: 'อัปเดต',
      create_withdraw_password: 'ตั้งรหัสถอนเงิน',
      create_password: 'สร้างรหัสผ่าน',
      username: 'บัญชี',
      password: 'รหัสผ่าน',
      no_account: 'ยังไม่มีบัญชี?',
      have_account: 'มีบัญชีแล้ว?',
      otp: 'รหัสยืนยัน',
      send_code: 'ส่งรหัส',
      otp_note: 'OTP เป็นตัวอย่าง (6 หลัก)',
      admin_login: 'เข้าสู่ระบบแอดมิน',
      records_title_bet: 'ประวัติการเดิมพัน',
      records_title_deposit: 'ฝากเงิน',
      records_title_withdraw: 'ถอนเงิน',
      records_title_account: 'ข้อมูลบัญชี',
      records_title_created: 'เวลาสร้างบัญชี',
      records_title_traffic: 'บันทึกการใช้งาน',
      records_title_rebate: 'บันทึกรีเบต',
      start_chat: 'เริ่มแชท',
      quick_guide: 'คู่มือด่วน',
      cskh_welcome: 'สวัสดี! ให้เราช่วยอะไรดี?',
      image: 'รูปภาพ',
      enter_message: 'พิมพ์ข้อความ...',
      send: 'ส่ง'
    },
    fr: {
      login: 'Connexion',
      register: 'Inscription',
      logout: 'Déconnexion',
      logout_admin: 'Déconnexion admin',
      nav_home: 'Accueil',
      nav_casino: 'Casino',
      nav_lottery: 'Loterie',
      nav_lobby: 'Hall',
      nav_mine: 'Moi',
      settings_title: 'Paramètres',
      settings_language: 'Langue',
      close: 'Fermer',
      hero_title: 'Marina Bay Sands',
      hero_subtitle: 'Expérience casino premium.',
      hero_explore: 'Explorer le casino',
      hero_lottery: 'Aller à la loterie',
      quick_deposit: 'Dépôt',
      quick_withdraw: 'Retrait',
      quick_bet_history: 'Historique des paris',
      quick_online_service: 'Service en ligne',
      featured_games: 'Jeux en vedette',
      games_per_row: '3 jeux / ligne',
      odds_label: 'Cotes {low} / {high}',
      section_subtitle: 'Choisissez un jeu pour commencer. Design 5D et effets dynamiques.',
      back: '← Retour',
      back_home: '← Retour',
      record_no_data: 'Aucune donnée.',
      status_label: 'Statut',
      updated_label: 'Mise à jour',
      fee_label: 'Frais',
      net_label: 'Net',
      status_pending: 'En attente',
      status_approved: 'Approuvé',
      status_rejected: 'Refusé',
      time_remaining: 'Temps restant',
      rounds_running: 'Tours en cours',
      bet_choices: 'Choix de paris',
      bet_multi_select: 'Sélections multiples autorisées',
      result: 'Résultat',
      waiting_result: 'En attente du résultat...',
      view_bet_history: 'Voir l’historique',
      bet_big: 'Grand',
      bet_small: 'Petit',
      bet_big_plus: 'Très grand',
      bet_small_plus: 'Très petit',
      bet_lottery_big: 'Loterie grand',
      bet_lottery_small: 'Loterie petit',
      bet_animal_big: 'Grand',
      bet_animal_small: 'Petit',
      bet_hot: 'Chaud',
      bet_cold: 'Froid',
      bet_super13: 'Super 13',
      bet_bao60: 'Bao 60',
      bet_wave_red: 'Vague rouge',
      bet_wave_blue: 'Vague bleue',
      bet_wave_purple: 'Vague violette',
      bet_wave_yellow: 'Vague jaune',
      selected_count: 'Sélectionné',
      door_label: 'choix',
      total_formula: 'Total = montant par choix × nombre de choix',
      too_many_doors: 'Trop de choix.',
      per_door: 'Par choix',
      total_amount: 'Total',
      net_estimate: 'Gain/Perte estimé',
      bet_history: 'Historique des paris',
      bet_history_note: 'Voir les paris en cours et résultats ici.',
      open_history: 'Ouvrir l’historique',
      bet_amount_title: 'Montant de pari',
      current_balance: 'Solde actuel',
      balance_after: 'Solde après pari',
      custom_amount: 'Montant personnalisé',
      enter_amount: 'Saisir le montant',
      max_per_door_hint: 'Sélectionnez pour voir le max par choix.',
      max_per_door_prefix: 'Max par choix',
      place_bet: 'Placer un pari',
      bet_over_balance: 'Le total dépasse le solde.',
      bet_over_balance_title: 'Le total dépasse le solde actuel.',
      bet_err_max_select: 'Maximum 2 choix.',
      bet_err_min_select: 'Sélectionnez au moins 1 choix.',
      bet_err_amount: 'Saisissez le montant.',
      bet_err_balance: 'Échec : solde insuffisant.',
      bet_err_place_failed: 'Impossible de placer le pari.',
      bet_success: 'Pari réussi !',
      bet_placed_template: 'Pari {amount}$ - Solde {balance}',
      bet_result_template: 'Résultat : {outcome} (cote {odds}) - {net}',
      bet_net_win: 'Gain +{amount}$',
      bet_net_lose: 'Perte -{amount}$',
      upload_avatar: 'Télécharger avatar',
      please_login: 'Veuillez vous connecter.',
      total_balance: 'Solde total',
      income: 'Revenu',
      profit_loss: 'Profit & perte',
      deposit: 'Dépôt',
      withdraw: 'Retrait',
      record_bet_history: 'Historique des paris',
      record_deposit_history: 'Historique des dépôts',
      record_withdraw_history: 'Historique des retraits',
      record_traffic: 'Journal de trafic',
      record_account: 'Infos compte',
      record_cskh: 'Service client',
      record_rebate: 'Journal des remises',
      record_created: 'Date de création',
      change_language: 'Changer la langue',
      font_size: 'Taille de police',
      change_password: 'Changer le mot de passe',
      change_withdraw_password: 'Changer le mot de passe de retrait',
      withdraw_need_bank: 'Banque non liée. Veuillez lier une banque.',
      bank_link_title: 'Lier la banque',
      full_name: 'Nom complet',
      phone: 'Téléphone',
      bank_account: 'Compte bancaire',
      bank_name: 'Nom de la banque',
      bank_notice_1: '1. Le nom doit correspondre au compte bancaire.',
      bank_notice_2: '2. Les données ne peuvent pas être modifiées après enregistrement.',
      save_bank_link: 'Enregistrer le lien',
      username_label: 'Nom d’utilisateur',
      withdraw_min: 'Retrait min. : 100$',
      amount: 'Montant',
      withdraw_password_new: 'Nouveau mot de passe de retrait',
      withdraw_password_confirm: 'Confirmer le mot de passe',
      withdraw_password: 'Mot de passe de retrait',
      submit_request: 'Soumettre',
      deposit_note: 'Saisissez le montant et la note (optionnel).',
      note: 'Note',
      deposit_placeholder: 'Code / note de virement',
      bank_transfer_info: 'Infos de virement',
      supported_banks: 'Banques prises en charge',
      change_login_password: 'Changer le mot de passe de connexion',
      new_password: 'Nouveau mot de passe',
      update: 'Mettre à jour',
      create_withdraw_password: 'Créer mot de passe de retrait',
      create_password: 'Créer le mot de passe',
      username: 'Identifiant',
      password: 'Mot de passe',
      no_account: 'Pas de compte ?',
      have_account: 'Déjà un compte ?',
      otp: 'Code OTP',
      send_code: 'Envoyer le code',
      otp_note: 'OTP démo (6 chiffres).',
      admin_login: 'Connexion admin',
      records_title_bet: 'Historique des paris',
      records_title_deposit: 'Dépôt',
      records_title_withdraw: 'Retrait',
      records_title_account: 'Infos compte',
      records_title_created: 'Date de création',
      records_title_traffic: 'Journal de trafic',
      records_title_rebate: 'Journal des remises',
      start_chat: 'Démarrer le chat',
      quick_guide: 'Guide rapide',
      cskh_welcome: 'Bonjour ! Comment puis-je vous aider ?',
      image: 'Image',
      enter_message: 'Saisir un message...',
      send: 'Envoyer'
    },
    es: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      logout: 'Cerrar sesión',
      logout_admin: 'Cerrar sesión admin',
      nav_home: 'Inicio',
      nav_casino: 'Casino',
      nav_lottery: 'Lotería',
      nav_lobby: 'Lobby',
      nav_mine: 'Mi cuenta',
      settings_title: 'Configuración',
      settings_language: 'Idioma',
      close: 'Cerrar',
      hero_title: 'Marina Bay Sands',
      hero_subtitle: 'Experiencia premium de casino.',
      hero_explore: 'Explorar casino',
      hero_lottery: 'Ir a lotería',
      quick_deposit: 'Depósito',
      quick_withdraw: 'Retiro',
      quick_bet_history: 'Historial de apuestas',
      quick_online_service: 'Servicio en línea',
      featured_games: 'Juegos destacados',
      games_per_row: '3 juegos / fila',
      odds_label: 'Cuotas {low} / {high}',
      section_subtitle: 'Elige un juego para empezar. Diseño 5D y efectos dinámicos.',
      back: '← Volver',
      back_home: '← Volver',
      record_no_data: 'Sin datos.',
      status_label: 'Estado',
      updated_label: 'Actualizado',
      fee_label: 'Tarifa',
      net_label: 'Neto',
      status_pending: 'Pendiente',
      status_approved: 'Aprobado',
      status_rejected: 'Rechazado',
      time_remaining: 'Tiempo restante',
      rounds_running: 'Rondas en curso',
      bet_choices: 'Opciones de apuesta',
      bet_multi_select: 'Selección múltiple permitida',
      result: 'Resultado',
      waiting_result: 'Esperando resultado...',
      view_bet_history: 'Ver historial',
      bet_big: 'Grande',
      bet_small: 'Pequeño',
      bet_big_plus: 'Muy grande',
      bet_small_plus: 'Muy pequeño',
      bet_lottery_big: 'Lotería grande',
      bet_lottery_small: 'Lotería pequeña',
      bet_animal_big: 'Grande',
      bet_animal_small: 'Pequeño',
      bet_hot: 'Caliente',
      bet_cold: 'Frío',
      bet_super13: 'Súper 13',
      bet_bao60: 'Bao 60',
      bet_wave_red: 'Ola roja',
      bet_wave_blue: 'Ola azul',
      bet_wave_purple: 'Ola morada',
      bet_wave_yellow: 'Ola amarilla',
      selected_count: 'Seleccionado',
      door_label: 'opciones',
      total_formula: 'Total = monto por opción × número de opciones',
      too_many_doors: 'Demasiadas opciones.',
      per_door: 'Por opción',
      total_amount: 'Total',
      net_estimate: 'Ganancia/Pérdida estimada',
      bet_history: 'Historial de apuestas',
      bet_history_note: 'Ver apuestas en curso y resultados aquí.',
      open_history: 'Abrir historial',
      bet_amount_title: 'Monto de apuesta',
      current_balance: 'Saldo actual',
      balance_after: 'Saldo después de apostar',
      custom_amount: 'Monto personalizado',
      enter_amount: 'Ingresar monto',
      max_per_door_hint: 'Selecciona para ver máximo por opción.',
      max_per_door_prefix: 'Máximo por opción',
      place_bet: 'Apostar',
      bet_over_balance: 'El total supera el saldo.',
      bet_over_balance_title: 'El total supera el saldo actual.',
      bet_err_max_select: 'Máximo 2 opciones.',
      bet_err_min_select: 'Selecciona al menos 1 opción.',
      bet_err_amount: 'Ingresa el monto.',
      bet_err_balance: 'Falló: saldo insuficiente.',
      bet_err_place_failed: 'No se pudo apostar.',
      bet_success: '¡Apuesta exitosa!',
      bet_placed_template: 'Apuesta {amount}$ - Saldo {balance}',
      bet_result_template: 'Resultado: {outcome} (cuota {odds}) - {net}',
      bet_net_win: 'Gana +{amount}$',
      bet_net_lose: 'Pierde -{amount}$',
      upload_avatar: 'Subir avatar',
      please_login: 'Por favor inicia sesión.',
      total_balance: 'Saldo total',
      income: 'Ingresos',
      profit_loss: 'Ganancia y pérdida',
      deposit: 'Depósito',
      withdraw: 'Retiro',
      record_bet_history: 'Historial de apuestas',
      record_deposit_history: 'Historial de depósitos',
      record_withdraw_history: 'Historial de retiros',
      record_traffic: 'Registro de tráfico',
      record_account: 'Información de cuenta',
      record_cskh: 'Soporte',
      record_rebate: 'Registro de reembolsos',
      record_created: 'Fecha de creación',
      change_language: 'Cambiar idioma',
      font_size: 'Tamaño de fuente',
      change_password: 'Cambiar contraseña',
      change_withdraw_password: 'Cambiar contraseña de retiro',
      withdraw_need_bank: 'Banco no vinculado. Vincula un banco.',
      bank_link_title: 'Vincular banco',
      full_name: 'Nombre completo',
      phone: 'Teléfono',
      bank_account: 'Cuenta bancaria',
      bank_name: 'Nombre del banco',
      bank_notice_1: '1. El nombre debe coincidir con el banco.',
      bank_notice_2: '2. No se puede editar después de guardar.',
      save_bank_link: 'Guardar vínculo',
      username_label: 'Usuario',
      withdraw_min: 'Retiro mínimo: 100$',
      amount: 'Monto',
      withdraw_password_new: 'Nueva contraseña de retiro',
      withdraw_password_confirm: 'Confirmar contraseña',
      withdraw_password: 'Contraseña de retiro',
      submit_request: 'Enviar solicitud',
      deposit_note: 'Ingrese monto y nota (opcional).',
      note: 'Nota',
      deposit_placeholder: 'Código / nota de transferencia',
      bank_transfer_info: 'Información de transferencia',
      supported_banks: 'Bancos compatibles',
      change_login_password: 'Cambiar contraseña de acceso',
      new_password: 'Nueva contraseña',
      update: 'Actualizar',
      create_withdraw_password: 'Crear contraseña de retiro',
      create_password: 'Crear contraseña',
      username: 'Usuario',
      password: 'Contraseña',
      no_account: '¿No tienes cuenta?',
      have_account: '¿Ya tienes cuenta?',
      otp: 'Código OTP',
      send_code: 'Enviar código',
      otp_note: 'OTP demo (6 dígitos).',
      admin_login: 'Inicio admin',
      records_title_bet: 'Historial de apuestas',
      records_title_deposit: 'Depósito',
      records_title_withdraw: 'Retiro',
      records_title_account: 'Información de cuenta',
      records_title_created: 'Fecha de creación',
      records_title_traffic: 'Registro de tráfico',
      records_title_rebate: 'Registro de reembolsos',
      start_chat: 'Iniciar chat',
      quick_guide: 'Guía rápida',
      cskh_welcome: '¡Hola! ¿En qué puedo ayudarte?',
      image: 'Imagen',
      enter_message: 'Escribe un mensaje...',
      send: 'Enviar'
    }
  };

  const formatText = (text, args) => {
    if (!args) return text;
    return Object.entries(args).reduce(
      (result, [key, value]) => result.replaceAll(`{${key}}`, value),
      text
    );
  };

  const getTranslation = (key, args, fallback) => {
    const dict = translations[activeLang] || translations.en;
    let value = dict[key] || fallback;
    if (value && args) value = formatText(value, args);
    return value;
  };

  const applyLanguage = (lang) => {
    activeLang = lang || 'vi';
    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const args = el.getAttribute('data-i18n-args');
      let value = dict[key];
      if (!value) return;
      if (args) {
        try {
          value = formatText(value, JSON.parse(args));
        } catch {
          // ignore
        }
      }
      el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key) return;
      const value = dict[key];
      if (!value) return;
      el.setAttribute('placeholder', value);
    });
  };

  langSelects.forEach((select) => {
    if (storedLang) select.value = storedLang;
    select.addEventListener('change', (event) => {
      localStorage.setItem('language', event.target.value);
      activeLang = event.target.value;
      langSelects.forEach((other) => {
        if (other !== event.target) other.value = event.target.value;
      });
      applyLanguage(event.target.value);
    });
  });

  applyLanguage(storedLang || 'vi');
  window.getTranslation = getTranslation;
}

const withdrawSubmit = document.getElementById('withdraw-submit');
if (withdrawSubmit) {
  withdrawSubmit.addEventListener('click', async () => {
    const amount = Number(document.getElementById('withdraw-amount')?.value || 0);
    let password = String(document.getElementById('withdraw-password')?.value || '').trim();
    const newPasswordInput = document.getElementById('withdraw-password-new');
    const confirmInput = document.getElementById('withdraw-password-confirm');
    if (newPasswordInput && confirmInput) {
      const newPassword = String(newPasswordInput.value || '').trim();
      const confirmPassword = String(confirmInput.value || '').trim();
      if (!newPassword || newPassword.length < 4) {
        alert('Mật khẩu rút tiền tối thiểu 4 ký tự.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('Mật khẩu nhập lại không khớp.');
        return;
      }
      const pwResponse = await fetch('/api/withdraw/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const pwData = await pwResponse.json();
      if (!pwResponse.ok) {
        alert(pwData.message || 'Không thể cập nhật mật khẩu rút tiền.');
        return;
      }
      password = newPassword;
    }
    if (amount < 100) {
      alert('Số tiền rút tối thiểu là 100$.');
      return;
    }
    if (!password) {
      alert('Vui lòng nhập mật khẩu rút tiền.');
      return;
    }
    const response = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, password }),
    });
    const data = await response.json();
    alert(data.message || 'Đã gửi yêu cầu rút tiền.');
    if (response.ok) window.location.reload();
  });
}

const withdrawPasswordSubmit = document.getElementById('withdraw-password-submit');
if (withdrawPasswordSubmit) {
  withdrawPasswordSubmit.addEventListener('click', async () => {
    const password = String(document.getElementById('withdraw-password-new')?.value || '').trim();
    if (!password || password.length < 4) {
      alert('Mật khẩu rút tiền tối thiểu 4 ký tự.');
      return;
    }
    const response = await fetch('/api/withdraw/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    alert(data.message || 'Đã cập nhật mật khẩu rút tiền.');
    if (response.ok) window.location.reload();
  });
}

const depositSubmit = document.getElementById('deposit-submit');
if (depositSubmit) {
  depositSubmit.addEventListener('click', async () => {
    const amount = Number(document.getElementById('deposit-amount')?.value || 0);
    const note = String(document.getElementById('deposit-note')?.value || '').trim();
    if (amount <= 0) {
      alert('Vui lòng nhập số tiền nạp.');
      return;
    }
    const params = new URLSearchParams({
      amount: String(amount),
      note,
    });
    window.location.href = `/cskh?${params.toString()}`;
  });
}

const amountChips = document.querySelectorAll('.amount-chip');
const betAmountInput = document.getElementById('bet-amount');
const betSubmit = document.getElementById('bet-submit');
const betAmountBox = document.querySelector('.bet-amount');
const balanceValueEl = document.getElementById('balance-value');
const resultText = document.getElementById('result-text');
const gamePanel = document.querySelector('.bet-panel');
const gameSlug = gamePanel?.getAttribute('data-game') || '';
const betPerDoorEl = document.getElementById('bet-per-door');
const betTotalEl = document.getElementById('bet-total');
const betNetEl = document.getElementById('bet-net');
const balanceWarningEl = document.getElementById('balance-warning');
const betBalanceAfterEl = document.getElementById('bet-balance-after');
const betMaxPerDoorEl = document.getElementById('bet-max-per-door');

const t = (key, args, fallback) => window.getTranslation?.(key, args, fallback) || fallback || key;

const roundMs = 10 * 60 * 1000;
const vnOffsetMinutes = 7 * 60;

const getVietnamNowMs = () => {
  const now = Date.now();
  const utc = now + new Date().getTimezoneOffset() * 60 * 1000;
  return utc + vnOffsetMinutes * 60 * 1000;
};

const getOptionLabel = (button) => {
  if (!button) return '';
  const labelSpan = button.querySelector('span');
  if (labelSpan) return labelSpan.textContent.trim();
  return button.textContent.trim();
};

let currentBalance = Number(betAmountBox?.getAttribute('data-balance') || 0);
let isBetLocked = false;
let placedBetAmount = 0;
let currentBetId = null;
let currentBetRoundIndex = null;
let isSettlingBet = false;
let settleRetryTimer = null;
let pendingOutcomeName = null;
let pendingOutcomeOdds = null;
const currentBetKey = 'currentBetInfo';

const loadCurrentBetInfo = () => {
  try {
    const raw = localStorage.getItem(currentBetKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveCurrentBetInfo = (info) => {
  if (!info) {
    localStorage.removeItem(currentBetKey);
    return;
  }
  localStorage.setItem(currentBetKey, JSON.stringify(info));
};

const formatMoney = (value) => {
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.max(0, safe));
};

const formatBalance = (value) => `${formatMoney(value)}$`;
const parseMoneyText = (text) => {
  if (!text) return 0;
  let value = String(text).replace(/[^0-9,.-]/g, '').trim();
  if (!value) return 0;
  const hasComma = value.includes(',');
  const hasDot = value.includes('.');
  if (hasComma && hasDot) {
    value = value.replace(/\./g, '').replace(',', '.');
  } else if (hasComma && !hasDot) {
    value = value.replace(',', '.');
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};
if (!Number.isFinite(currentBalance) || currentBalance < 0) {
  currentBalance = parseMoneyText(balanceValueEl?.textContent || '');
}

const parseAmount = (value) => {
  const numeric = Number(String(value || '').replace(',', '.'));
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.round(numeric * 100) / 100;
};

let isAutoSettingAmount = false;

const updateBalanceDisplay = () => {
  if (balanceValueEl) balanceValueEl.textContent = formatBalance(currentBalance);
  if (betAmountBox) betAmountBox.setAttribute('data-balance', String(currentBalance));
};

updateBalanceDisplay();

const updateBetSummary = () => {
  const amount = parseAmount(betAmountInput?.value || 0);
  const selectedOptions = Array.from(document.querySelectorAll('.bet-option.active'));
  const selectedCount = selectedOptions.length || 0;
  const odds = Number(selectedOptions[0]?.getAttribute('data-odds') || 0);
  const total = amount * selectedCount;
  const payout = selectedCount ? amount * odds : 0;
  const net = selectedCount ? payout - total : 0;
  const balanceAfter = currentBalance - total;

  if (betPerDoorEl) betPerDoorEl.textContent = `${formatMoney(amount)}$`;
  if (betTotalEl) betTotalEl.textContent = `${formatMoney(total)}$`;
  if (betBalanceAfterEl) {
    betBalanceAfterEl.textContent = `${formatMoney(Math.max(0, balanceAfter))}$`;
    betBalanceAfterEl.classList.toggle('negative', balanceAfter < 0);
  }
  if (betNetEl) {
    const sign = net >= 0 ? '+' : '';
    betNetEl.textContent = `${sign}${formatMoney(Math.abs(net))}$`;
    betNetEl.classList.toggle('positive', net > 0);
    betNetEl.classList.toggle('negative', net < 0);
  }
  if (betMaxPerDoorEl) {
    if (selectedCount > 0) {
      const maxPerDoor = currentBalance / selectedCount;
      const prefix = window.getTranslation?.('max_per_door_prefix', null, 'Tối đa mỗi cửa') || 'Tối đa mỗi cửa';
      betMaxPerDoorEl.textContent = `${prefix}: ${formatMoney(maxPerDoor)}$`;
    } else {
      const hint = window.getTranslation?.('max_per_door_hint', null, 'Chọn cửa để xem tối đa mỗi cửa.') || 'Chọn cửa để xem tối đa mỗi cửa.';
      betMaxPerDoorEl.textContent = hint;
    }
  }
};
const storedBet = loadCurrentBetInfo();
if (storedBet && storedBet.id) {
  currentBetId = storedBet.id;
  placedBetAmount = Number(storedBet.amount || 0);
  currentBetRoundIndex = Number.isFinite(storedBet.roundIndex) ? storedBet.roundIndex : null;
  const currentRoundIndex = Math.floor(getVietnamNowMs() / roundMs);
  if (currentBetRoundIndex === null || currentRoundIndex - currentBetRoundIndex > 2) {
    currentBetId = null;
    placedBetAmount = 0;
    currentBetRoundIndex = null;
    isBetLocked = false;
    saveCurrentBetInfo(null);
  } else {
    isBetLocked = true;
  }
}

const getActiveChipPercent = () => {
  const active = document.querySelector('.amount-chip.active');
  return active ? Number(active.getAttribute('data-percent') || 0) : 0;
};

const setAmountFromPercent = (percent) => {
  if (!betAmountInput || !betAmountBox) return;
  const selectedCount = document.querySelectorAll('.bet-option.active').length;
  const balance = Number(betAmountBox.getAttribute('data-balance') || 0);
  const total = (balance * percent) / 100;
  const perDoor = selectedCount > 0 ? total / selectedCount : 0;
  isAutoSettingAmount = true;
  betAmountInput.value = perDoor > 0 ? String(Math.round(perDoor * 100) / 100) : '';
  isAutoSettingAmount = false;
};

const updateBetState = () => {
  const selectedCount = document.querySelectorAll('.bet-option.active').length;
  const activePercent = getActiveChipPercent();
  if (activePercent) {
    setAmountFromPercent(activePercent);
  }
  const amount = parseAmount(betAmountInput?.value || 0);
  const totalStake = amount * Math.max(selectedCount, 1);
  const canBet =
    !isBetLocked &&
    selectedCount >= 1 &&
    amount > 0 &&
    totalStake <= currentBalance;
  if (betSubmit) betSubmit.disabled = !canBet;
  if (betTotalEl) {
    const isOver = totalStake > currentBalance && amount > 0;
    betTotalEl.classList.toggle('over', isOver);
    if (isOver) {
      const badge = window.getTranslation?.('bet_over_balance', null, 'Tổng cược vượt số dư.') || 'Tổng cược vượt số dư.';
      const title = window.getTranslation?.('bet_over_balance_title', null, 'Tổng cược vượt số dư hiện tại.') || 'Tổng cược vượt số dư hiện tại.';
      betTotalEl.setAttribute('data-warning', badge);
      betTotalEl.setAttribute('title', title);
    } else {
      betTotalEl.removeAttribute('data-warning');
      betTotalEl.removeAttribute('title');
    }
    if (balanceWarningEl) balanceWarningEl.classList.toggle('active', isOver);
  }
  updateBetSummary();
};

const betGrid = document.querySelector('.bet-grid');
if (betGrid) {
  const max = Number(betGrid.getAttribute('data-max') || 2);
  const countEl = document.getElementById('selected-count');
  const warningEl = document.getElementById('bet-warning');
  betGrid.addEventListener('click', (event) => {
    if (isBetLocked) return;
    const target = event.target.closest('.bet-option');
    if (!target) return;

    const selectedBefore = betGrid.querySelectorAll('.bet-option.active');
    if (target.classList.contains('active')) {
      target.classList.remove('active');
    } else if (selectedBefore.length < max) {
      target.classList.add('active');
    } else {
      if (warningEl) warningEl.classList.add('active');
      setTimeout(() => warningEl && warningEl.classList.remove('active'), 1500);
    }

    const newCount = betGrid.querySelectorAll('.bet-option.active').length;
    if (countEl) countEl.textContent = newCount;
    updateBetState();
  });
}

if (amountChips.length && betAmountInput) {
  amountChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (isBetLocked) return;
      amountChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const percent = Number(chip.getAttribute('data-percent') || 0);
      setAmountFromPercent(percent);
      updateBetState();
    });
  });
}

if (betAmountInput) {
  betAmountInput.addEventListener('input', () => {
    if (!isAutoSettingAmount) {
      amountChips.forEach((chip) => chip.classList.remove('active'));
    }
    updateBetState();
  });
  updateBetState();
}

if (betSubmit && betAmountInput) {
  betSubmit.addEventListener('click', async () => {
    const amount = parseAmount(betAmountInput.value || 0);
    const selected = document.querySelectorAll('.bet-option.active').length;
    const selectedOptions = Array.from(document.querySelectorAll('.bet-option.active'));
    if (selected > 2) {
      showBetToast(t('bet_err_max_select', null, 'Chỉ được chọn tối đa 2 cửa.'), false);
      return;
    }
    if (selected < 1) {
      showBetToast(t('bet_err_min_select', null, 'Vui lòng chọn ít nhất 1 cửa để đặt cược.'), false);
      return;
    }
    if (amount <= 0) {
      showBetToast(t('bet_err_amount', null, 'Vui lòng nhập số tiền đặt cược.'), false);
      return;
    }
    const totalStake = amount * Math.max(selected, 1);
    if (totalStake > currentBalance) {
      showBetToast(t('bet_err_balance', null, 'Không thành công: Số dư không đủ.'), false);
      return;
    }
    const selections = selectedOptions.map(getOptionLabel).filter(Boolean);
    const roundIndex = Math.floor(getVietnamNowMs() / roundMs);
    const odds = Number(selectedOptions[0]?.getAttribute('data-odds') || 1);
    const response = await fetch('/api/bet/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selections,
        amount,
        odds,
        selection_count: selections.length,
        game_slug: gameSlug,
        round: roundIndex,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const message = data.message || t('bet_err_place_failed', null, 'Không thể đặt cược.');
      if (message.includes('Số dư không đủ') || message.includes('insufficient')) {
        showBetToast(t('bet_err_balance', null, 'Không thành công: Số dư không đủ.'), false);
      } else {
        showBetToast(message, false);
      }
      return;
    }
    currentBetId = data.bet_id;
    currentBalance = Number(data.balance || currentBalance);
    placedBetAmount = amount;
    currentBetRoundIndex = roundIndex;
    isBetLocked = true;
    saveCurrentBetInfo({ id: currentBetId, amount, roundIndex });
    updateBalanceDisplay();
    updateBetState();
    if (resultText) {
      resultText.textContent = t(
        'bet_placed_template',
        { amount: formatMoney(totalStake), balance: formatBalance(currentBalance) },
        `Đã đặt cược ${formatMoney(totalStake)}$ - Số dư còn ${formatBalance(currentBalance)}`
      );
    }
    showBetToast(t('bet_success', null, 'Đặt cược thành công!'), true);
    if (betAmountInput) betAmountInput.setAttribute('disabled', 'true');
    amountChips.forEach((chip) => chip.setAttribute('disabled', 'true'));
    const options = document.querySelectorAll('.bet-option');
    options.forEach((opt) => opt.classList.add('locked'));
  });
}

const countdownEl = document.getElementById('countdown');
const roundCountEl = document.getElementById('round-count');
if (countdownEl && resultText) {
  let lastRoundIndex = null;

  const resetBetState = () => {
    isBetLocked = false;
    placedBetAmount = 0;
    currentBetId = null;
    currentBetRoundIndex = null;
    pendingOutcomeName = null;
    pendingOutcomeOdds = null;
    saveCurrentBetInfo(null);
    const countEl = document.getElementById('selected-count');
    if (countEl) countEl.textContent = '0';
    const options = document.querySelectorAll('.bet-option');
    options.forEach((opt) => opt.classList.remove('active', 'locked'));
    amountChips.forEach((chip) => {
      chip.classList.remove('active');
      chip.removeAttribute('disabled');
    });
    if (betAmountInput) {
      betAmountInput.value = '';
      betAmountInput.removeAttribute('disabled');
    }
    updateBetState();
    updateCountdownDisplay();
  };

  const isInvalidBetMessage = (message) => {
    if (!message) return false;
    const text = String(message).toLowerCase();
    return (
      text.includes('không tìm thấy cược') ||
      text.includes('cược đã kết thúc') ||
      text.includes('vui lòng đăng nhập') ||
      text.includes('not found') ||
      text.includes('already finished') ||
      text.includes('unauthorized')
    );
  };

  const scheduleSettleRetry = () => {
    if (settleRetryTimer) clearTimeout(settleRetryTimer);
    settleRetryTimer = setTimeout(() => {
      if (currentBetId && !isSettlingBet) {
        resolveRound();
      }
    }, 3000);
  };

  const updateRoundCount = () => {
    if (roundCountEl) {
      const nextRound = Math.floor(100 + Math.random() * 900);
      roundCountEl.textContent = String(nextRound);
    }
  };

  const updateCountdownDisplay = () => {
    const vnNow = getVietnamNowMs();
    const elapsedInRound = Math.floor((vnNow % roundMs) / 1000);
    const remaining = 600 - elapsedInRound;
    const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
    const seconds = String(remaining % 60).padStart(2, '0');
    countdownEl.textContent = `${minutes}:${seconds}`;
  };

  const resolveRound = () => {
    updateRoundCount();
    const options = Array.from(document.querySelectorAll('.bet-option'));
    if (!options.length) return;
    const outcome = options[Math.floor(Math.random() * options.length)];
    const outcomeName = pendingOutcomeName || getOptionLabel(outcome) || outcome.textContent.trim().split('\n')[0];
    const odds = pendingOutcomeOdds || outcome.getAttribute('data-odds') || '-';
    if (currentBetId) {
      if (isSettlingBet) return;
      pendingOutcomeName = outcomeName;
      pendingOutcomeOdds = odds;
      isSettlingBet = true;
      fetch('/api/bet/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bet_id: currentBetId, outcome: outcomeName }),
      })
        .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
          if (data.ok) {
            currentBalance = Number(data.balance || currentBalance);
            updateBalanceDisplay();
            if (data.status === 'win') {
                        const net = Number(data.net ?? (Number(data.payout || 0) - Number(data.total_stake || placedBetAmount || 0)));
                        const netLabel = net >= 0
                          ? t('bet_net_win', { amount: formatMoney(net) }, `Lãi +${formatMoney(net)}$`)
                          : t('bet_net_lose', { amount: formatMoney(Math.abs(net)) }, `Lỗ -${formatMoney(Math.abs(net))}$`);
                        resultText.textContent = t(
                          'bet_result_template',
                          { outcome: outcomeName, odds, net: netLabel },
                          `Kết quả: ${outcomeName} (odds ${odds}) - ${netLabel}`
                        );
            } else {
                        const totalStake = Number(data.total_stake || placedBetAmount || 0);
                        const netLabel = t('bet_net_lose', { amount: formatMoney(totalStake) }, `Lỗ -${formatMoney(totalStake)}$`);
                        resultText.textContent = t(
                          'bet_result_template',
                          { outcome: outcomeName, odds, net: netLabel },
                          `Kết quả: ${outcomeName} (odds ${odds}) - ${netLabel}`
                        );
            }
            resetBetState();
          } else {
            resultText.textContent = `Kết quả: ${outcomeName} (odds ${odds})`;
            if (!ok || isInvalidBetMessage(data.message)) {
              resetBetState();
            } else {
              scheduleSettleRetry();
            }
          }
        })
        .catch(() => {
          resultText.textContent = `Kết quả: ${outcomeName} (odds ${odds})`;
          scheduleSettleRetry();
        })
        .finally(() => {
          isSettlingBet = false;
        });
    } else {
      resultText.textContent = `Kết quả: ${outcomeName} (odds ${odds})`;
      resetBetState();
    }
  };

  const tick = () => {
    const vnNow = getVietnamNowMs();
    const roundIndex = Math.floor(vnNow / roundMs);
    updateCountdownDisplay();

    if (
      currentBetId &&
      Number.isFinite(currentBetRoundIndex) &&
      roundIndex > currentBetRoundIndex
    ) {
      resolveRound();
    }

    if (lastRoundIndex === null) {
      lastRoundIndex = roundIndex;
      return;
    }

    if (roundIndex !== lastRoundIndex) {
      lastRoundIndex = roundIndex;
      resolveRound();
    }
  };

  const timerId = setInterval(tick, 1000);
  tick();
}

const cskhInput = document.getElementById('cskh-message');
const cskhSend = document.getElementById('cskh-send');
const cskhImage = document.getElementById('cskh-image');
const cskhChat = document.querySelector('.cskh-chat');
if (cskhInput && cskhSend && cskhChat) {
  const endpoint = cskhChat.getAttribute('data-endpoint');
  const params = new URLSearchParams(window.location.search);
  const preAmount = params.get('amount');
  const preNote = params.get('note');

  const renderMessages = (messages) => {
    cskhChat.innerHTML = '';
    messages.forEach((msg) => {
      const bubble = document.createElement('div');
      bubble.className = `chat-message${msg.sender === 'user' ? ' user' : ''}`;
      if (msg.text) {
        const textNode = document.createElement('div');
        textNode.textContent = msg.text;
        bubble.appendChild(textNode);
      }
      if (msg.image) {
        const img = document.createElement('img');
        img.className = 'chat-image';
        img.src = msg.image;
        img.alt = 'Ảnh';
        bubble.appendChild(img);
      }
      cskhChat.appendChild(bubble);
    });
    cskhChat.scrollTop = cskhChat.scrollHeight;
  };

  const loadMessages = async () => {
    if (!endpoint) return;
    const response = await fetch(endpoint);
    const data = await response.json();
    renderMessages(data.messages || []);
  };

  const sendMessage = async () => {
    const text = cskhInput.value.trim();
    const imageFile = cskhImage?.files?.[0];
    if ((!text && !imageFile) || !endpoint) return;

    let response;
    if (imageFile) {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('image', imageFile);
      response = await fetch(endpoint, { method: 'POST', body: formData });
    } else {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
    }
    const data = await response.json();
    renderMessages(data.messages || []);
    cskhInput.value = '';
    if (cskhImage) cskhImage.value = '';
  };

  cskhSend.addEventListener('click', sendMessage);
  cskhInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });

  loadMessages();

  if (preAmount) {
    const message = `Yêu cầu nạp tiền: ${preAmount}$${preNote ? ` | Ghi chú: ${preNote}` : ''}`;
    cskhInput.value = message;
    sendMessage();
  }
}

const adminMenu = document.querySelector('.admin-menu');
if (adminMenu) {
  const menuItems = Array.from(adminMenu.querySelectorAll('[data-section]'));
  const sections = Array.from(document.querySelectorAll('.admin-block[data-section]'));

  const setActiveMenu = (sectionId) => {
    menuItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('data-section') === sectionId);
    });
  };

  const toggleSections = (sectionId) => {
    const showAll = sectionId === 'section-home';
    sections.forEach((section) => {
      const match = section.getAttribute('data-section') === sectionId;
      section.classList.toggle('hidden', !(showAll || match));
    });
  };

  const scrollToSection = (sectionId) => {
    const target = sections.find((section) => section.getAttribute('data-section') === sectionId);
    toggleSections(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveMenu(sectionId);
    history.replaceState(null, '', `#${sectionId}`);
  };

  menuItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const sectionId = item.getAttribute('data-section');
      if (!sectionId) return;
      scrollToSection(sectionId);
    });
  });

  const initialSection = (window.location.hash || '').replace('#', '');
  if (initialSection) {
    scrollToSection(initialSection);
  } else if (menuItems[0]) {
    const firstSection = menuItems[0].getAttribute('data-section');
    toggleSections(firstSection);
    setActiveMenu(firstSection);
  }
}

const approvalSection = document.getElementById('section-approval');
if (approvalSection) {
  const idInput = approvalSection.querySelector('input[name="tx_user_id"]');
  const userSelect = approvalSection.querySelector('select[name="tx_username"]');

  const findOptionById = (value) => {
    if (!userSelect) return null;
    const target = String(value || '').trim();
    if (!target) return null;
    return Array.from(userSelect.options).find(
      (opt) => String(opt.getAttribute('data-user-id') || '').trim() === target
    );
  };

  if (idInput && userSelect) {
    idInput.addEventListener('input', () => {
      const match = findOptionById(idInput.value);
      if (match) {
        userSelect.value = match.value;
      } else if (!String(idInput.value || '').trim()) {
        userSelect.value = '';
      }
    });

    userSelect.addEventListener('change', () => {
      const selected = userSelect.options[userSelect.selectedIndex];
      const userId = selected?.getAttribute('data-user-id') || '';
      if (idInput) idInput.value = userId;
    });
  }
}

const adminChat = document.querySelector('.admin-chat');
if (adminChat) {
  const replyEndpoint = adminChat.getAttribute('data-reply-endpoint');
  const threadItems = Array.from(adminChat.querySelectorAll('.chat-thread-item'));
  const threadCards = Array.from(adminChat.querySelectorAll('.chat-thread-card'));

  const setActiveThread = (chatId) => {
    threadItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('data-chat-id') === chatId);
    });
    threadCards.forEach((card) => {
      card.classList.toggle('active', card.getAttribute('data-chat-id') === chatId);
    });
  };

  const updateThreadPreview = (chatId, text) => {
    const item = threadItems.find((el) => el.getAttribute('data-chat-id') === chatId);
    if (!item) return;
    const preview = item.querySelector('.thread-preview');
    if (preview) preview.textContent = text || '...';
    const time = item.querySelector('.thread-time');
    if (time) time.textContent = new Date().toISOString();
    const badge = item.querySelector('.unread-badge');
    if (badge) badge.remove();
  };

  if (threadItems.length) {
    const firstId = threadItems[0].getAttribute('data-chat-id');
    if (firstId) setActiveThread(firstId);
  }

  adminChat.addEventListener('click', (event) => {
    const item = event.target.closest('.chat-thread-item');
    if (item) {
      const chatId = item.getAttribute('data-chat-id');
      if (chatId) setActiveThread(chatId);
    }
  });

  const renderThreadMessages = (card, messages) => {
    const body = card.querySelector('.chat-thread-body');
    if (!body) return;
    body.innerHTML = '';
    messages.forEach((msg) => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender === 'user' ? 'user' : 'agent'}`;
      if (msg.text) {
        const textNode = document.createElement('div');
        textNode.textContent = msg.text;
        bubble.appendChild(textNode);
      }
      if (msg.image) {
        const img = document.createElement('img');
        img.className = 'chat-image';
        img.src = msg.image;
        img.alt = 'Ảnh';
        bubble.appendChild(img);
      }
      body.appendChild(bubble);
    });
  };

  adminChat.addEventListener('click', async (event) => {
    const btn = event.target.closest('.admin-reply-btn');
    if (!btn || !replyEndpoint) return;
    const card = btn.closest('.chat-thread-card');
    if (!card) return;
    const input = card.querySelector('.chat-reply-input');
    const imageInput = card.querySelector('.chat-reply-image');
    const text = input?.value.trim();
    const imageFile = imageInput?.files?.[0];
    const chatId = card.getAttribute('data-chat-id');
    if ((!text && !imageFile) || !chatId) return;

    btn.disabled = true;
    try {
      let response;
      if (imageFile) {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('text', text || '');
        formData.append('image', imageFile);
        response = await fetch(replyEndpoint, { method: 'POST', body: formData });
      } else {
        response = await fetch(replyEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text }),
        });
      }
      const data = await response.json();
      if (response.ok && data.messages) {
        renderThreadMessages(card, data.messages);
        updateThreadPreview(chatId, text || (imageFile ? '[Ảnh]' : ''));
        if (input) input.value = '';
        if (imageInput) imageInput.value = '';
      } else {
        alert(data.message || 'Gửi thất bại.');
      }
    } catch (error) {
      alert('Không thể gửi tin nhắn.');
    } finally {
      btn.disabled = false;
    }
  });

  adminChat.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const input = event.target.closest('.chat-reply-input');
    if (!input) return;
    const card = input.closest('.chat-thread-card');
    const btn = card?.querySelector('.admin-reply-btn');
    if (btn) {
      event.preventDefault();
      btn.click();
    }
  });
}
