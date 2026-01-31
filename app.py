import json
import os
import re
import uuid
from datetime import datetime
from pathlib import Path

from flask import Flask, flash, redirect, render_template, request, send_from_directory, session, url_for, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "dev-secret-change-me"

ADMIN_USERNAME = "Admin123"
ADMIN_PASSWORD = "Admin123123"

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = BASE_DIR / "uploads"

DATA_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)

SITE_CONFIG_PATH = DATA_DIR / "site.json"
CSKH_PATH = DATA_DIR / "cskh_messages.json"
GAMES_PATH = DATA_DIR / "games.json"
TX_PATH = DATA_DIR / "transactions.json"
USERS_PATH = DATA_DIR / "users.json"
BETS_PATH = DATA_DIR / "bets.json"

TELEGRAM_CSKH = "https://t.me/xiaobaolacky"

GAMES_DEFAULT = [
    {"name": "Phi Thuyền May Mắn", "slug": "phi-thuyen-may-man", "category": "casino"},
    {"name": "May Mắn Đến", "slug": "may-man-den", "category": "casino"},
    {"name": "Ngôi Sao May Mắn", "slug": "ngoi-sao-may-man", "category": "casino"},
    {"name": "Sổ Xố Đếm Ngược", "slug": "so-xo-dem-nguoc", "category": "casino"},
    {"name": "Rất Vui", "slug": "rat-vui", "category": "casino"},
    {"name": "Nhanh Lên Sổ Xố", "slug": "nhanh-len-so-xo", "category": "casino"},
    {"name": "Nhanh 1", "slug": "nhanh-1", "category": "casino"},
    {"name": "Nhanh 2", "slug": "nhanh-2", "category": "casino"},
    {"name": "Nhanh 3", "slug": "nhanh-3", "category": "casino"},
    {"name": "Nhanh 4", "slug": "nhanh-4", "category": "casino"},
    {"name": "Nhanh 5", "slug": "nhanh-5", "category": "casino"},
    {"name": "Nhanh 6", "slug": "nhanh-6", "category": "casino"},
    {"name": "Singapore PK 10", "slug": "singapore-pk-10", "category": "casino"},
    {"name": "Cược Hạnh Phúc", "slug": "cuoc-hanh-phuc", "category": "casino"},
    {"name": "Hạnh Phúc 1", "slug": "hanh-phuc-1", "category": "casino"},
    {"name": "Hạnh Phúc 2", "slug": "hanh-phuc-2", "category": "casino"},
    {"name": "Hạnh Phúc 3", "slug": "hanh-phuc-3", "category": "casino"},
    {"name": "Hạnh Phúc 4", "slug": "hanh-phuc-4", "category": "casino"},
    {"name": "Hạnh Phúc 5", "slug": "hanh-phuc-5", "category": "casino"},
    {"name": "Hạnh Phúc 6", "slug": "hanh-phuc-6", "category": "casino"},
    {"name": "Hạnh Phúc 7", "slug": "hanh-phuc-7", "category": "casino"},
    {"name": "Hạnh Phúc 9", "slug": "hanh-phuc-9", "category": "casino"},
    {"name": "Số Xố Singapore", "slug": "so-xo-singapore", "category": "casino"},
]

BANKS_VN = [
    "Vietcombank",
    "VietinBank",
    "BIDV",
    "Agribank",
    "Techcombank",
    "ACB",
    "MB Bank",
    "Sacombank",
    "VPBank",
    "TPBank",
    "HDBank",
    "VIB",
    "SHB",
    "OCB",
    "SeABank",
    "LienVietPostBank",
    "MSB",
    "Nam A Bank",
    "Bac A Bank",
    "PVcomBank",
    "ABBANK",
    "Eximbank",
    "Viet Capital Bank",
    "SCB",
    "Saigonbank",
    "PG Bank",
    "KienlongBank",
    "BaoViet Bank",
    "VietBank",
    "CBBank",
    "OceanBank",
    "GPBank",
    "Standard Chartered",
    "HSBC",
    "Shinhan Bank",
    "UOB",
    "Citibank",
    "Woori Bank",
    "Public Bank",
    "Maybank",
    "Kookmin",
]

USERS = {}


def load_users():
    if not USERS_PATH.exists():
        save_users({})
    with USERS_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_users(users):
    with USERS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(users, handle, ensure_ascii=False, indent=2)


USERS = load_users()


def default_site_config():
    return {
        "site_name": "SANDS",
        "logo": "",
        "landing_banner": "",
        "hero_images": [],
        "marquee": [
            "Nguyễn A vừa thắng 520$ tại Phi Thuyền May Mắn",
            "Trần B đang chơi Singapore PK 10 và lãi 1200$",
            "Lê C thắng 88$ tại Sổ Xố Đếm Ngược",
        ],
        "odds_low": 1.98,
        "odds_high": 2.1,
        "game_images": {},
        "theme_primary": "#7d3cff",
        "theme_accent": "#00d9ff",
        "updated_at": "",
        "banks_config": "",
        "bank_transfer_info": "",
        "tips": "",
        "fee_deposit": 0.0,
        "fee_withdraw": 0.0,
        "cskh_notice": "CSKH luôn sẵn sàng phục vụ 24/7",
        "cskh_title": "CSKH SANDS",
        "cskh_subtitle": "Hỗ trợ 24/7",
        "cskh_self_title": "Hướng dẫn tự phục vụ",
        "cskh_self_subtitle": "Nhanh & tiện lợi",
        "cskh_banner_title": "Hỗ trợ khách hàng nhanh chóng",
        "cskh_banner_text": "Hệ thống chăm sóc khách hàng 24/7. Trả lời trong vài phút.",
        "cskh_quick_guides": [
            "Gửi yêu cầu nạp/rút tiền.",
            "Hỗ trợ tài khoản và bảo mật.",
            "Tra cứu lịch sử giao dịch.",
        ],
        "cskh_logo": "",
    }


def load_site_config():
    if not SITE_CONFIG_PATH.exists():
        save_site_config(default_site_config())
    with SITE_CONFIG_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_site_config(config):
    with SITE_CONFIG_PATH.open("w", encoding="utf-8") as handle:
        json.dump(config, handle, ensure_ascii=False, indent=2)


def load_games():
    if not GAMES_PATH.exists():
        save_games(GAMES_DEFAULT)
    with GAMES_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_games(games):
    with GAMES_PATH.open("w", encoding="utf-8") as handle:
        json.dump(games, handle, ensure_ascii=False, indent=2)


def load_cskh_messages():
    if not CSKH_PATH.exists():
        save_cskh_messages({})
    with CSKH_PATH.open("r", encoding="utf-8") as handle:
        raw = json.load(handle)
    data = {}
    for chat_id, thread in raw.items():
        if isinstance(thread, list):
            data[chat_id] = {"user_id": "", "username": "", "messages": thread}
        else:
            data[chat_id] = thread
    return data


def save_cskh_messages(data):
    with CSKH_PATH.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)


def load_transactions():
    if not TX_PATH.exists():
        save_transactions([])
    with TX_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_transactions(items):
    with TX_PATH.open("w", encoding="utf-8") as handle:
        json.dump(items, handle, ensure_ascii=False, indent=2)


def load_bets():
    if not BETS_PATH.exists():
        save_bets([])
    with BETS_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_bets(items):
    with BETS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(items, handle, ensure_ascii=False, indent=2)


def get_chat_id():
    if "chat_id" not in session:
        session["chat_id"] = uuid.uuid4().hex
    return session["chat_id"]


def slugify(name):
    value = re.sub(r"[^\w\s-]", "", name.lower()).strip()
    value = re.sub(r"[\s_]+", "-", value)
    return value


def current_user():
    global USERS
    user_id = session.get("user_id")
    if not user_id:
        return None
    user = USERS.get(user_id)
    if user:
        return user
    try:
        USERS = load_users()
    except Exception:
        return None
    return USERS.get(user_id)


def find_user_by_username(username):
    if not username:
        return None
    for user in USERS.values():
        if user.get("username") == username:
            return user
    return None


def get_user_odds(user, game_slug, default_config=None):
    """Return odds dict for a user and specific game.
    Falls back to site-wide odds when no override is set.
    """
    default_high = 2.1
    default_low = 1.98
    if default_config:
        try:
            default_high = float(default_config.get("odds_high", default_high))
            default_low = float(default_config.get("odds_low", default_low))
        except Exception:
            pass
    if not user:
        return {"odds_high": default_high, "odds_low": default_low}
    overrides = user.get("odds_overrides", {}) or {}
    odds = overrides.get(game_slug) or {}
    return {
        "odds_high": float(odds.get("odds_high", default_high)),
        "odds_low": float(odds.get("odds_low", default_low)),
    }


def get_current_round_index():
    round_ms = 10 * 60 * 1000
    vn_offset_minutes = 7 * 60
    now = datetime.utcnow().timestamp() * 1000
    vn_now = now + vn_offset_minutes * 60 * 1000
    return int(vn_now // round_ms)


def normalize_label(value):
    return " ".join(str(value).split()).strip().lower()


PAIR_GROUPS = [
    {"lớn", "nhỏ"},
    {"lớn to", "nhỏ bé"},
    {"sổ xố to", "sổ xố nhỏ"},
    {"con to", "con nhỏ"},
    {"nóng", "lạnh"},
    {"tuyệt 13 cực nổ", "báo 60"},
    {"làn sóng đỏ", "làn sóng xanh"},
    {"làn sóng tím", "làn sóng vàng"},
]


def is_same_pair(selections):
    if len(selections) != 2:
        return False
    normalized = {normalize_label(item) for item in selections}
    return any(normalized == group for group in PAIR_GROUPS)


def get_pair_options(selections):
    if len(selections) != 2:
        return []
    normalized = {normalize_label(item) for item in selections}
    for group in PAIR_GROUPS:
        if normalized == group:
            lookup = {normalize_label(item): item for item in selections}
            return [lookup.get(label, label) for label in group]
    return []


def settle_pending_bets(user):
    if not user:
        return
    bets = load_bets()
    current_round = get_current_round_index()
    updated = False
    for bet in bets:
        if bet.get("user_id") != user.get("id"):
            continue
        if bet.get("status") != "pending":
            continue
        bet_round = bet.get("round")
        try:
            bet_round = int(bet_round)
        except Exception:
            bet_round = None
        if bet_round is None or bet_round >= current_round:
            continue

        selections = bet.get("selections") or []
        total_stake = float(bet.get("total_stake", bet.get("amount", 0) or 0))
        base_amount = float(bet.get("amount", 0))
        odds = float(bet.get("odds", 1))

        pair_options = bet.get("pair_options") or []
        if pair_options:
            outcome = pair_options[bet_round % 2]
            normalized_outcome = normalize_label(outcome)
            normalized_selections = {normalize_label(item) for item in selections}
            is_win = normalized_outcome in normalized_selections
        else:
            outcome = "Hệ thống"
            is_win = False

        if is_win:
            payout = round(base_amount * odds, 2)
            net = round(payout - total_stake, 2)
            bet["status"] = "win"
            bet["outcome"] = outcome
            bet["payout"] = payout
            bet["settled_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            user["balance"] = round(float(user.get("balance", 0)) + payout, 2)
            user["income"] = round(float(user.get("income", 0)) + payout, 2)
            user["profit"] = round(float(user.get("profit", 0)) + net, 2)
        else:
            bet["status"] = "lose"
            bet["outcome"] = outcome
            bet["payout"] = 0
            bet["settled_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            user["loss"] = round(float(user.get("loss", 0)) + total_stake, 2)
        updated = True

    if updated:
        save_users(USERS)
        save_bets(bets)


def is_admin():
    return session.get("is_admin") is True


def require_admin():
    if not is_admin():
        flash("Vui lòng đăng nhập hậu đài.", "error")
        return redirect(url_for("admin_login"))
    return None


@app.context_processor
def inject_admin_context():
    return {
        "is_admin": is_admin(),
        "admin_username": ADMIN_USERNAME,
    }


PUBLIC_ENDPOINTS = {
    "home",
    "login",
    "register",
    "cskh",
    "cskh_messages",
    "uploads",
    "static",
    "admin_login",
    "admin",
    "admin_logout",
}


@app.before_request
def guard_login():
    if request.endpoint in PUBLIC_ENDPOINTS:
        return None
    if request.endpoint and request.endpoint.startswith("admin"):
        return None
    if current_user() is None:
        return redirect(url_for("home"))
    return None


@app.route("/uploads/<path:filename>")
def uploads(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.route("/")
def home():
    config = load_site_config()
    user = current_user()
    if not user:
        return render_template(
            "auth/entry.html",
            user=None,
            config=config,
            telegram_link=TELEGRAM_CSKH,
        )
    games = load_games()
    return render_template(
        "home.html",
        user=user,
        config=config,
        games=games[:6],
        telegram_link=TELEGRAM_CSKH,
        active_tab="home",
    )


@app.route("/casino")
def casino():
    config = load_site_config()
    games = load_games()
    return render_template(
        "section.html",
        user=current_user(),
        config=config,
        games=games,
        title="Casino",
        active_tab="casino",
        telegram_link=TELEGRAM_CSKH,
    )


@app.route("/lottery")
def lottery():
    config = load_site_config()
    games = load_games()
    return render_template(
        "section.html",
        user=current_user(),
        config=config,
        games=games,
        title="Xổ Số",
        active_tab="lottery",
        telegram_link=TELEGRAM_CSKH,
    )


@app.route("/lobby")
def lobby():
    config = load_site_config()
    games = load_games()
    return render_template(
        "section.html",
        user=current_user(),
        config=config,
        games=games,
        title="Đại Sảnh",
        active_tab="lobby",
        telegram_link=TELEGRAM_CSKH,
    )


@app.route("/mine", methods=["GET", "POST"])
def mine():
    config = load_site_config()
    user = current_user()
    settle_pending_bets(user)
    transactions = load_transactions()
    user_transactions = []
    income_total = 0.0
    profit_loss = 0.0
    if user:
        income_total = float(user.get("income", 0) or 0)
        profit_value = float(user.get("profit", 0) or 0)
        loss_value = float(user.get("loss", 0) or 0)
        profit_loss = round(profit_value - loss_value, 2)
        user_transactions = [
            tx for tx in transactions if tx.get("user_id") == user.get("id")
        ]
        user_transactions = sorted(
            user_transactions, key=lambda item: item.get("created_at", ""), reverse=True
        )[:6]
    if request.method == "POST":
        if not user:
            flash("Vui lòng đăng nhập trước.", "error")
            return redirect(url_for("login"))
        avatar_file = request.files.get("avatar")
        if avatar_file and avatar_file.filename:
            filename = f"avatar-{user['id']}-{uuid.uuid4().hex}.png"
            avatar_path = UPLOAD_DIR / filename
            avatar_file.save(avatar_path)
            user["avatar"] = f"/uploads/{filename}"
            flash("Cập nhật avatar thành công.", "success")

        if request.form.get("bank_name"):
            user["bank"] = {
                "full_name": request.form.get("full_name"),
                "phone": request.form.get("phone"),
                "bank_name": request.form.get("bank_name"),
                "account_number": request.form.get("account_number"),
            }
            flash("Liên kết ngân hàng thành công.", "success")

        save_users(USERS)

        return redirect(url_for("mine"))

    return render_template(
        "mine.html",
        user=user,
        config=config,
        banks=BANKS_VN,
        user_transactions=user_transactions,
        income_total=income_total,
        profit_loss=profit_loss,
        telegram_link=TELEGRAM_CSKH,
        active_tab="mine",
    )


@app.route("/game/<slug>")
def game_detail(slug):
    config = load_site_config()
    games = load_games()
    game = next((g for g in games if g["slug"] == slug), None)
    if not game:
        flash("Không tìm thấy trò chơi.", "error")
        return redirect(url_for("home"))
    user = current_user()
    user_odds = get_user_odds(user, slug, config)
    return render_template(
        "game.html",
        user=user,
        config=config,
        game=game,
        user_odds=user_odds,
        telegram_link=TELEGRAM_CSKH,
        active_tab="home",
    )


@app.route("/records/<record_type>")
def records(record_type):
    config = load_site_config()
    user = current_user()
    settle_pending_bets(user)
    records_list = []
    if user:
        if record_type == "bet":
            bets = load_bets()
            records_list = [b for b in bets if b.get("user_id") == user.get("id")]
        elif record_type in {"deposit", "withdraw"}:
            transactions = load_transactions()
            records_list = [
                t
                for t in transactions
                if t.get("user_id") == user.get("id") and t.get("type") == record_type
            ]
        elif record_type == "account":
            records_list = [
                {
                    "label": "Tài khoản",
                    "value": user.get("username"),
                },
                {
                    "label": "Số dư",
                    "value": f"{user.get('balance', 0)}$",
                },
                {
                    "label": "Ngày tạo",
                    "value": user.t("created_at"),
                },
            ]
        elif record_type == "created":
            records_list = [
                {
                    "label": "Ngày tạo",
                    "value": user.get("created_at"),
                }
            ]
    return render_template(
        "records.html",
        user=user,
        config=config,
        record_type=record_type,
        records=records_list,
        telegram_link=TELEGRAM_CSKH,
    )


@app.route("/api/deposit", methods=["POST"])
def api_deposit():
    user = current_user()
    if not user:
        return jsonify({"ok": False, "message": "Vui lòng đăng nhập."}), 401
    if user.get("status") == "locked":
        return jsonify({"ok": False, "message": "Tài khoản đã bị khóa."}), 403
    payload = request.get_json(silent=True) or {}
    amount_raw = payload.get("amount")
    note = (payload.get("note") or "").strip()
    try:
        amount = float(amount_raw or 0)
    except (TypeError, ValueError):
        amount = 0
    if amount <= 0:
        return jsonify({"ok": False, "message": "Số tiền không hợp lệ."}), 400

    transactions = load_transactions()
    transactions.append(
        {
            "id": uuid.uuid4().hex[:8],
            "type": "deposit",
            "user_id": user.get("id"),
            "username": user.get("username"),
            "amount": amount,
            "fee": 0,
            "net_amount": amount,
            "note": note,
            "status": "pending",
            "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": "",
        }
    )
    save_transactions(transactions)
    return jsonify({"ok": True, "message": "Đã tạo yêu cầu nạp tiền."})


@app.route("/api/withdraw/password", methods=["POST"])
def api_withdraw_password():
    user = current_user()
    if not user:
        return jsonify({"ok": False, "message": "Vui lòng đăng nhập."}), 401
    payload = request.get_json(silent=True) or {}
    password = (payload.get("password") or "").strip()
    if len(password) < 4:
        return jsonify({"ok": False, "message": "Mật khẩu rút tiền tối thiểu 4 ký tự."}), 400

    user["withdraw_password"] = password
    save_users(USERS)
    return jsonify({"ok": True, "message": "Đã cập nhật mật khẩu rút tiền."})


@app.route("/api/withdraw", methods=["POST"])
def api_withdraw():
    user = current_user()
    if not user:
        return jsonify({"ok": False, "message": "Vui lòng đăng nhập."}), 401
    if user.get("status") == "locked":
        return jsonify({"ok": False, "message": "Tài khoản đã bị khóa."}), 403
    if not user.get("bank"):
        return jsonify({"ok": False, "message": "Vui lòng liên kết ngân hàng trước."}), 400
    payload = request.get_json(silent=True) or {}
    amount_raw = payload.get("amount")
    password = (payload.get("password") or "").strip()
    try:
        amount = float(amount_raw or 0)
    except (TypeError, ValueError):
        amount = 0
    if not user.get("withdraw_password"):
        return jsonify({"ok": False, "message": "Vui lòng tạo mật khẩu rút tiền."}), 400
    if password != user.get("withdraw_password"):
        return jsonify({"ok": False, "message": "Mật khẩu rút tiền không đúng."}), 400
    if amount < 100:
        return jsonify({"ok": False, "message": "Số tiền rút tối thiểu là 100$."}), 400
    if amount > float(user.get("balance", 0)):
        return jsonify({"ok": False, "message": "Số dư không đủ để rút."}), 400

    user["balance"] = round(float(user.get("balance", 0)) - float(amount), 2)
    save_users(USERS)

    bank = user.get("bank") or {}
    bank_note = " - ".join(
        [
            part
            for part in [
                bank.get("bank_name", ""),
                bank.get("account_number", ""),
                bank.get("full_name", ""),
            ]
            if part
        ]
    )

    transactions = load_transactions()
    transactions.append(
        {
            "id": uuid.uuid4().hex[:8],
            "type": "withdraw",
            "user_id": user.get("id"),
            "username": user.get("username"),
            "amount": amount,
            "fee": 0,
            "net_amount": amount,
            "note": bank_note,
            "status": "pending",
            "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": "",
            "reserved": True,
        }
    )
    save_transactions(transactions)
    return jsonify({"ok": True, "message": "Đã tạo yêu cầu rút tiền."})


@app.route("/api/bet/place", methods=["POST"])
def api_bet_place():
    user = current_user()
    if not user:
        return jsonify({"ok": False, "message": "Vui lòng đăng nhập."}), 401
    if user.get("status") == "locked":
        return jsonify({"ok": False, "message": "Tài khoản đã bị khóa."}), 403
    payload = request.get_json(silent=True) or {}
    selections = payload.get("selections") or []
    game_slug = (payload.get("game_slug") or "").strip()
    round_id = get_current_round_index()
    odds_raw = payload.get("odds")
    try:
        amount = float(payload.get("amount") or 0)
    except (TypeError, ValueError):
        amount = 0
    try:
        odds = float(odds_raw or 1)
    except (TypeError, ValueError):
        odds = 1.0

    selections = [str(item).strip() for item in selections if str(item).strip()]
    selections = list(dict.fromkeys(selections))
    selection_count = len(selections)

    if not selections or amount <= 0:
        return jsonify({"ok": False, "message": "Thiếu dữ liệu đặt cược."}), 400
    if selection_count < 1:
        return jsonify({"ok": False, "message": "Vui lòng chọn ít nhất 1 cửa."}), 400
    if selection_count > 2:
        return jsonify({"ok": False, "message": "Chỉ được chọn tối đa 2 cửa."}), 400
    if selection_count == 2 and not is_same_pair(selections):
        return jsonify({"ok": False, "message": "Chỉ được chọn 2 cửa cùng cặp đối nhau."}), 400

    config = load_site_config()
    user_odds = get_user_odds(user, game_slug, config)
    allowed_odds = {float(user_odds.get("odds_high", 2.1)), float(user_odds.get("odds_low", 1.98))}
    if odds not in allowed_odds:
        odds = float(user_odds.get("odds_high", 2.1))
    amount = round(amount, 2)
    total_stake = round(amount * max(selection_count, 1), 2)
    if total_stake > float(user.get("balance", 0)):
        return jsonify({"ok": False, "message": "Số dư không đủ."}), 400

    user["balance"] = round(float(user.get("balance", 0)) - total_stake, 2)
    save_users(USERS)

    bets = load_bets()
    bet_ids = []
    pair_id = uuid.uuid4().hex[:8] if selection_count == 2 else ""
    pair_options = get_pair_options(selections) if selection_count == 2 else []

    for selection in selections:
        bet_id = uuid.uuid4().hex[:10]
        bet_ids.append(bet_id)
        bets.append(
            {
                "id": bet_id,
                "user_id": user.get("id"),
                "username": user.get("username"),
                "game_slug": game_slug,
                "round": round_id,
                "selections": [selection],
                "selection_count": 1,
                "amount": amount,
                "total_stake": amount,
                "odds": odds,
                "status": "pending",
                "outcome": "",
                "payout": 0,
                "pair_id": pair_id,
                "pair_options": pair_options,
                "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                "settled_at": "",
            }
        )

    save_bets(bets)
    return jsonify({"ok": True, "bet_ids": bet_ids, "balance": user.get("balance")})


@app.route("/api/bet/settle", methods=["POST"])
def api_bet_settle():
    user = current_user()
    if not user:
        return jsonify({"ok": False, "message": "Vui lòng đăng nhập."}), 401
    if user.get("status") == "locked":
        return jsonify({"ok": False, "message": "Tài khoản đã bị khóa."}), 403
    payload = request.get_json(silent=True) or {}
    bet_id = (payload.get("bet_id") or "").strip()
    outcome = (payload.get("outcome") or "").strip()

    if not bet_id:
        return jsonify({"ok": False, "message": "Thiếu mã cược."}), 400

    bets = load_bets()
    bet = next((b for b in bets if b.get("id") == bet_id and b.get("user_id") == user.get("id")), None)
    if not bet:
        return jsonify({"ok": False, "message": "Không tìm thấy cược."}), 404
    if bet.get("status") != "pending":
        return jsonify({"ok": False, "message": "Cược đã kết thúc."}), 400

    selections = bet.get("selections") or []
    normalized_outcome = normalize_label(outcome)
    normalized_selections = {normalize_label(item) for item in selections}
    if is_same_pair(selections) and normalized_outcome not in normalized_selections:
        bet_round = bet.get("round")
        try:
            bet_round = int(bet_round)
        except Exception:
            bet_round = 0
        outcome = selections[bet_round % 2] if len(selections) == 2 else (selections[0] if selections else outcome)
        normalized_outcome = normalize_label(outcome)
    is_win = normalized_outcome in normalized_selections
    base_amount = float(bet.get("amount", 0))
    total_stake = float(bet.get("total_stake", bet.get("amount", 0)))
    odds = float(bet.get("odds", 1))
    payout = round(base_amount * odds, 2) if is_win else 0
    net = round(payout - total_stake, 2) if is_win else -total_stake
    bet["status"] = "win" if is_win else "lose"
    bet["outcome"] = outcome
    bet["payout"] = payout
    bet["settled_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    if is_win:
        user["balance"] = round(float(user.get("balance", 0)) + payout, 2)
        user["income"] = round(float(user.get("income", 0)) + payout, 2)
        user["profit"] = round(float(user.get("profit", 0)) + net, 2)
    else:
        user["loss"] = round(float(user.get("loss", 0)) + total_stake, 2)

    save_users(USERS)
    save_bets(bets)
    return jsonify({
        "ok": True,
        "balance": user.get("balance"),
        "status": bet.get("status"),
        "payout": payout,
        "net": net,
        "amount": bet.get("amount", 0),
        "total_stake": bet.get("total_stake", bet.get("amount", 0)),
    })


@app.route("/cskh")
def cskh():
    if not current_user():
        flash("Vui lòng đăng nhập để chat CSKH.", "error")
        return redirect(url_for("login"))
    config = load_site_config()
    return render_template(
        "cskh.html",
        user=current_user(),
        config=config,
        telegram_link=TELEGRAM_CSKH,
    )


@app.route("/cskh/messages", methods=["GET", "POST"])
def cskh_messages():
    if not current_user():
        return jsonify({"message": "Vui lòng đăng nhập."}), 401
    chat_id = get_chat_id()
    data = load_cskh_messages()
    thread = data.get(chat_id, {"user_id": "", "username": "", "messages": []})
    messages = thread.get("messages", [])

    user = current_user()
    if user:
        thread["user_id"] = user.get("id", "")
        thread["username"] = user.get("username", "")

    if request.method == "POST":
        payload = request.get_json(silent=True) or {}
        text = (payload.get("text") or "").strip()
        image_url = ""

        if request.files:
            image_file = request.files.get("image")
            if image_file and image_file.filename:
                safe_name = secure_filename(image_file.filename)
                ext = Path(safe_name).suffix or ".png"
                filename = f"cskh-{chat_id}-{uuid.uuid4().hex}{ext}"
                image_path = UPLOAD_DIR / filename
                image_file.save(image_path)
                image_url = f"/uploads/{filename}"
        elif request.form:
            text = (request.form.get("text") or "").strip()

        if text or image_url:
            messages.append(
                {
                    "sender": "user",
                    "text": text,
                    "image": image_url,
                    "ts": datetime.utcnow().isoformat(),
                }
            )
            thread["messages"] = messages[-200:]
            data[chat_id] = thread
            save_cskh_messages(data)
        return jsonify({"messages": thread.get("messages", [])})

    return jsonify({"messages": thread.get("messages", [])})


@app.route("/admin/cskh/reply", methods=["POST"])
def admin_cskh_reply():
    guard = require_admin()
    if guard:
        return guard

    payload = request.get_json(silent=True) or {}
    chat_id = (payload.get("chat_id") or "").strip()
    text = (payload.get("text") or "").strip()
    image_url = ""

    if request.files:
        image_file = request.files.get("image")
        if image_file and image_file.filename:
            safe_name = secure_filename(image_file.filename)
            ext = Path(safe_name).suffix or ".png"
            filename = f"cskh-admin-{uuid.uuid4().hex}{ext}"
            image_path = UPLOAD_DIR / filename
            image_file.save(image_path)
            image_url = f"/uploads/{filename}"
        if request.form:
            chat_id = (request.form.get("chat_id") or chat_id).strip()
            text = (request.form.get("text") or text).strip()

    if not chat_id or (not text and not image_url):
        return jsonify({"ok": False, "message": "Thiếu dữ liệu."}), 400

    data = load_cskh_messages()
    thread = data.get(chat_id)
    if not thread:
        return jsonify({"ok": False, "message": "Không tìm thấy cuộc trò chuyện."}), 404

    messages = thread.get("messages", [])
    messages.append(
        {
            "sender": "agent",
            "text": text,
            "image": image_url,
            "ts": datetime.utcnow().isoformat(),
        }
    )
    thread["messages"] = messages[-200:]
    data[chat_id] = thread
    save_cskh_messages(data)

    return jsonify({"ok": True, "messages": thread.get("messages", [])})


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        global USERS
        USERS = load_users()
        username = request.form.get("username")
        password = request.form.get("password")
        for user_id, user in USERS.items():
            if user["username"] == username and user["password"] == password:
                session["user_id"] = user_id
                session.permanent = True
                flash("Đăng nhập thành công.", "success")
                return redirect(url_for("home"))
        flash("Sai tài khoản hoặc mật khẩu.", "error")
    config = load_site_config()
    return render_template("auth/login.html", telegram_link=TELEGRAM_CSKH, config=config)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        global USERS
        USERS = load_users()
        username = request.form.get("username")
        password = request.form.get("password")
        phone = request.form.get("phone")
        otp = request.form.get("otp")
        if not otp or len(otp) != 6:
            flash("Mã xác thực phải gồm 6 chữ số.", "error")
            return redirect(url_for("register"))
        if any(user["username"] == username for user in USERS.values()):
            flash("Tài khoản đã tồn tại.", "error")
            return redirect(url_for("register"))
        user_id = uuid.uuid4().hex[:10]
        USERS[user_id] = {
            "id": user_id,
            "username": username,
            "password": password,
            "phone": phone,
            "avatar": "",
            "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            "balance": 0.0,
            "income": 0.0,
            "profit": 0.0,
            "loss": 0.0,
            "status": "active",
            "withdraw_password": "",
            "odds_overrides": {},
        }
        save_users(USERS)
        session["user_id"] = user_id
        session.permanent = True
        flash("Đăng ký thành công.", "success")
        return redirect(url_for("home"))
    config = load_site_config()
    return render_template("auth/register.html", telegram_link=TELEGRAM_CSKH, config=config)


@app.route("/logout")
def logout():
    session.pop("user_id", None)
    flash("Đã đăng xuất.", "success")
    return redirect(url_for("home"))


@app.route("/admin", methods=["GET", "POST"])
def admin():
    guard = require_admin()
    if guard:
        return guard
    config = load_site_config()
    games = load_games()

    if request.method == "POST":
        section = request.form.get("section")
        config["site_name"] = request.form.get("site_name", config["site_name"])
        odds_low_raw = request.form.get("odds_low")
        odds_high_raw = request.form.get("odds_high")
        if odds_low_raw:
            config["odds_low"] = float(odds_low_raw)
        if odds_high_raw:
            config["odds_high"] = float(odds_high_raw)

        theme_primary = request.form.get("theme_primary")
        theme_accent = request.form.get("theme_accent")
        if theme_primary:
            config["theme_primary"] = theme_primary
        if theme_accent:
            config["theme_accent"] = theme_accent

        if request.form.get("clear_logo"):
            config["logo"] = ""

        if request.form.get("clear_landing_banner"):
            config["landing_banner"] = ""

        if request.form.get("clear_heroes"):
            config["hero_images"] = []

        delete_heroes = request.form.getlist("delete_heroes")
        if delete_heroes:
            current_heroes = config.get("hero_images", [])
            config["hero_images"] = [img for img in current_heroes if img not in delete_heroes]

        marquee_text = request.form.get("marquee")
        if marquee_text:
            config["marquee"] = [line.strip() for line in marquee_text.split("\n") if line.strip()]

        config["banks_config"] = request.form.get("banks_config", config.get("banks_config", ""))
        config["bank_transfer_info"] = request.form.get(
            "bank_transfer_info",
            config.get("bank_transfer_info", "")
        )
        config["tips"] = request.form.get("tips", config.get("tips", ""))
        fee_deposit_raw = request.form.get("fee_deposit")
        fee_withdraw_raw = request.form.get("fee_withdraw")
        if fee_deposit_raw:
            config["fee_deposit"] = float(fee_deposit_raw)
        if fee_withdraw_raw:
            config["fee_withdraw"] = float(fee_withdraw_raw)

        if section == "cskh_config":
            config["cskh_notice"] = request.form.get("cskh_notice", "").strip()
            config["cskh_title"] = request.form.get("cskh_title", "").strip()
            config["cskh_subtitle"] = request.form.get("cskh_subtitle", "").strip()
            config["cskh_self_title"] = request.form.get("cskh_self_title", "").strip()
            config["cskh_self_subtitle"] = request.form.get("cskh_self_subtitle", "").strip()
            config["cskh_banner_title"] = request.form.get("cskh_banner_title", "").strip()
            config["cskh_banner_text"] = request.form.get("cskh_banner_text", "").strip()
            guides_text = request.form.get("cskh_quick_guides", "").strip()
            config["cskh_quick_guides"] = [
                line.strip() for line in guides_text.split("\n") if line.strip()
            ]

            if request.form.get("clear_cskh_logo"):
                config["cskh_logo"] = ""

            cskh_logo_file = request.files.get("cskh_logo")
            if cskh_logo_file and cskh_logo_file.filename:
                safe_name = secure_filename(cskh_logo_file.filename)
                ext = Path(safe_name).suffix or ".png"
                filename = f"cskh-logo-{uuid.uuid4().hex}{ext}"
                logo_path = UPLOAD_DIR / filename
                cskh_logo_file.save(logo_path)
                config["cskh_logo"] = f"/uploads/{filename}"

        if section == "edit_games":
            games = load_games()
            updated = 0
            for game in games:
                form_key = f"game_name_{game['slug']}"
                new_name = (request.form.get(form_key) or "").strip()
                if new_name and new_name != game.get("name"):
                    game["name"] = new_name
                    updated += 1
            if updated:
                save_games(games)
                flash("Đã cập nhật tên trò chơi.", "success")
            else:
                flash("Không có thay đổi tên trò chơi.", "error")

        logo_file = request.files.get("logo")
        if logo_file and logo_file.filename:
            safe_name = secure_filename(logo_file.filename)
            ext = Path(safe_name).suffix or ".png"
            filename = f"logo-{uuid.uuid4().hex}{ext}"
            logo_path = UPLOAD_DIR / filename
            logo_file.save(logo_path)
            config["logo"] = f"/uploads/{filename}"
            flash("Đã cập nhật logo.", "success")
        elif section == "logo" and not request.form.get("clear_logo") and not request.files.getlist("hero_images") and not request.files.get("landing_banner"):
            flash("Chưa chọn file logo hoặc banner.", "error")

        landing_banner_file = request.files.get("landing_banner")
        if landing_banner_file and landing_banner_file.filename:
            safe_name = secure_filename(landing_banner_file.filename)
            ext = Path(safe_name).suffix or ".png"
            filename = f"landing-banner-{uuid.uuid4().hex}{ext}"
            banner_path = UPLOAD_DIR / filename
            landing_banner_file.save(banner_path)
            config["landing_banner"] = f"/uploads/{filename}"
            flash("Đã cập nhật banner đăng ký/đăng nhập.", "success")

        hero_files = request.files.getlist("hero_images")
        if hero_files:
            new_heroes = []
            for hero in hero_files:
                if not hero or not hero.filename:
                    continue
                safe_name = secure_filename(hero.filename)
                ext = Path(safe_name).suffix or ".png"
                filename = f"hero-{uuid.uuid4().hex}{ext}"
                hero_path = UPLOAD_DIR / filename
                hero.save(hero_path)
                new_heroes.append(f"/uploads/{filename}")
            if new_heroes:
                current_heroes = config.get("hero_images", [])
                config["hero_images"] = current_heroes + new_heroes
                flash("Đã cập nhật ảnh quảng cáo.", "success")

        game_slug = request.form.get("game_slug")
        game_image = request.files.get("game_image")
        if game_slug and game_image and game_image.filename:
            safe_name = secure_filename(game_image.filename)
            ext = Path(safe_name).suffix or ".png"
            filename = f"game-{game_slug}-{uuid.uuid4().hex}{ext}"
            game_path = UPLOAD_DIR / filename
            game_image.save(game_path)
            config.setdefault("game_images", {})[game_slug] = f"/uploads/{filename}"
            flash("Đã cập nhật logo trò chơi.", "success")
        elif section == "game" and not request.form.get("clear_game_image") and not request.form.get("delete_game_slug"):
            flash("Chưa chọn file logo trò chơi.", "error")

        if game_slug and request.form.get("clear_game_image"):
            config.setdefault("game_images", {}).pop(game_slug, None)

        if section == "game" and request.form.get("update_game_names"):
            games = load_games()
            updated = 0
            for game in games:
                form_key = f"game_name_{game['slug']}"
                new_name = (request.form.get(form_key) or "").strip()
                if new_name and new_name != game.get("name"):
                    game["name"] = new_name
                    updated += 1
            if updated:
                save_games(games)
                flash("Đã cập nhật tên trò chơi.", "success")
            else:
                flash("Không có thay đổi tên trò chơi.", "error")

        delete_game_slug = request.form.get("delete_game_slug")
        if delete_game_slug:
            config.setdefault("game_images", {}).pop(delete_game_slug, None)

        config["updated_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        save_site_config(config)
        flash("Cập nhật hậu đài thành công.", "success")
        return redirect(url_for("admin"))

    chat_data = load_cskh_messages()
    chat_threads = []
    for chat_id, thread in chat_data.items():
        messages = thread.get("messages", [])
        last_message = messages[-1] if messages else {}
        last_ts = last_message.get("ts", "")
        last_sender = last_message.get("sender", "")
        last_text = last_message.get("text", "")
        if not last_text and last_message.get("image"):
            last_text = "[Ảnh]"
        chat_threads.append(
            {
                "chat_id": chat_id,
                "user_id": thread.get("user_id") or "",
                "username": thread.get("username") or "",
                "messages": messages[-5:],
                "last_ts": last_ts,
                "last_sender": last_sender,
                "last_text": last_text,
                "unread": last_sender == "user",
            }
        )
    chat_threads.sort(key=lambda item: item.get("last_ts", ""), reverse=True)

    users = list(USERS.values())
    total_balance = round(sum(user.get("balance", 0) for user in users), 2)
    transactions = load_transactions()

    return render_template(
        "admin.html",
        config=config,
        games=games,
        telegram_link=TELEGRAM_CSKH,
        chat_threads=chat_threads,
        users=users,
        total_balance=total_balance,
        transactions=transactions,
    )


@app.route("/admin/games", methods=["POST"])
def admin_add_game():
    guard = require_admin()
    if guard:
        return guard
    name = (request.form.get("game_name") or "").strip()
    category = (request.form.get("game_category") or "casino").strip()
    if not name:
        flash("Vui lòng nhập tên trò chơi.", "error")
        return redirect(url_for("admin"))

    games = load_games()
    new_slug = slugify(name)
    if any(g["slug"] == new_slug for g in games):
        flash("Trò chơi đã tồn tại.", "error")
        return redirect(url_for("admin"))

    games.append({"name": name, "slug": new_slug, "category": category})
    save_games(games)
    flash("Đã thêm trò chơi mới.", "success")
    return redirect(url_for("admin"))


@app.route("/admin/transactions", methods=["POST"])
def admin_add_transaction():
    guard = require_admin()
    if guard:
        return guard
    config = load_site_config()
    tx_type = request.form.get("tx_type") or "deposit"
    user_id = (request.form.get("tx_user_id") or "").strip()
    username = (request.form.get("tx_username") or "").strip()
    amount_raw = request.form.get("tx_amount") or "0"
    instant = request.form.get("tx_instant") == "1"
    try:
        amount = float(amount_raw)
    except ValueError:
        amount = 0

    if amount <= 0:
        flash("Số tiền không hợp lệ.", "error")
        return redirect(url_for("admin"))

    if not username and not user_id:
        flash("Vui lòng chọn tài khoản.", "error")
        return redirect(url_for("admin"))

    user = USERS.get(user_id) if user_id else find_user_by_username(username)
    if not user:
        flash("Không tìm thấy tài khoản.", "error")
        return redirect(url_for("admin"))
    username = user.get("username")
    user_id = user.get("id")

    fee = 0.0
    net_amount = amount
    status = "pending"
    if tx_type == "deposit":
        if instant:
            fee = round(float(amount) * float(config.get("fee_deposit", 0)) / 100, 2)
            net_amount = round(float(amount) - fee, 2)
            user["balance"] = round(float(user.get("balance", 0)) + net_amount, 2)
            user["income"] = round(float(user.get("income", 0)) + net_amount, 2)
            status = "approved"
    elif tx_type == "withdraw":
        if float(user.get("balance", 0)) < float(amount):
            flash("Số dư không đủ để rút.", "error")
            return redirect(url_for("admin"))
        user["balance"] = round(float(user.get("balance", 0)) - float(amount), 2)
    else:
        status = "pending"

    transactions = load_transactions()
    transactions.append(
        {
            "id": uuid.uuid4().hex[:8],
            "type": tx_type,
            "user_id": user_id,
            "username": username,
            "amount": amount,
            "fee": fee,
            "net_amount": net_amount,
            "note": "",
            "status": status,
            "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S") if status == "approved" else "",
            "reserved": True if tx_type == "withdraw" else False,
        }
    )
    save_users(USERS)
    save_transactions(transactions)
    flash("Đã cập nhật nạp/rút thành công.", "success")
    return redirect(url_for("admin"))


@app.route("/admin/users/<user_id>/toggle", methods=["POST"])
def admin_toggle_user(user_id):
    guard = require_admin()
    if guard:
        return guard
    user = USERS.get(user_id)
    if not user:
        flash("Không tìm thấy người dùng.", "error")
        return redirect(url_for("admin"))
    user["status"] = "locked" if user.get("status") != "locked" else "active"
    save_users(USERS)
    flash("Đã cập nhật trạng thái người dùng.", "success")
    return redirect(url_for("admin"))


@app.route("/admin/users/<user_id>/balance", methods=["POST"])
def admin_update_user_balance(user_id):
    guard = require_admin()
    if guard:
        return guard
    user = USERS.get(user_id)
    if not user:
        flash("Không tìm thấy người dùng.", "error")
        return redirect(url_for("admin"))
    amount_raw = request.form.get("balance")
    try:
        amount = float(amount_raw or 0)
    except ValueError:
        amount = 0
    if amount < 0:
        flash("Số dư không hợp lệ.", "error")
        return redirect(url_for("admin"))
    user["balance"] = round(amount, 2)
    save_users(USERS)
    flash("Đã cập nhật số dư.", "success")
    return redirect(url_for("admin"))


@app.route("/admin/users/odds", methods=["POST"])
def admin_update_user_odds():
    guard = require_admin()
    if guard:
        return guard
    user_id = (request.form.get("odds_user_id") or "").strip()
    game_slug = (request.form.get("odds_game_slug") or "").strip()
    odds_low_raw = request.form.get("odds_low")
    odds_high_raw = request.form.get("odds_high")

    if not user_id or not game_slug:
        flash("Vui lòng chọn tài khoản và trò chơi.", "error")
        return redirect(url_for("admin"))

    user = USERS.get(user_id)
    if not user:
        flash("Không tìm thấy người dùng.", "error")
        return redirect(url_for("admin"))

    try:
        odds_low = float(odds_low_raw) if odds_low_raw else float(load_site_config().get("odds_low", 1.98))
        odds_high = float(odds_high_raw) if odds_high_raw else float(load_site_config().get("odds_high", 2.1))
    except ValueError:
        flash("Odds không hợp lệ.", "error")
        return redirect(url_for("admin"))

    if odds_low <= 0 or odds_high <= 0:
        flash("Odds phải lớn hơn 0.", "error")
        return redirect(url_for("admin"))

    overrides = user.get("odds_overrides", {}) or {}
    overrides[game_slug] = {"odds_low": odds_low, "odds_high": odds_high}
    user["odds_overrides"] = overrides
    save_users(USERS)
    flash("Đã cập nhật odds cho người dùng.", "success")
    return redirect(url_for("admin"))


@app.route("/admin/transactions/<tx_id>/<action>", methods=["POST"])
def admin_update_transaction(tx_id, action):
    guard = require_admin()
    if guard:
        return guard
    config = load_site_config()
    transactions = load_transactions()
    tx = next((t for t in transactions if t.get("id") == tx_id), None)
    if not tx:
        flash("Không tìm thấy giao dịch.", "error")
        return redirect(url_for("admin"))
    if tx.get("status") != "pending":
        flash("Giao dịch đã được xử lý.", "error")
        return redirect(url_for("admin"))

    user = USERS.get(tx.get("user_id")) if tx.get("user_id") else find_user_by_username(tx.get("username"))
    if action == "approve":
        if tx.get("type") == "deposit":
            fee = round(float(tx.get("amount", 0)) * float(config.get("fee_deposit", 0)) / 100, 2)
            net_amount = round(float(tx.get("amount", 0)) - fee, 2)
            tx["fee"] = fee
            tx["net_amount"] = net_amount
            if user:
                user["balance"] = round(float(user.get("balance", 0)) + net_amount, 2)
                user["income"] = round(float(user.get("income", 0)) + net_amount, 2)
        elif tx.get("type") == "withdraw":
            fee = round(float(tx.get("amount", 0)) * float(config.get("fee_withdraw", 0)) / 100, 2)
            net_amount = round(float(tx.get("amount", 0)) - fee, 2)
            tx["fee"] = fee
            tx["net_amount"] = net_amount
            if not user:
                flash("Không tìm thấy người dùng.", "error")
                return redirect(url_for("admin"))
            if not tx.get("reserved"):
                if float(user.get("balance", 0)) >= float(tx.get("amount", 0)):
                    user["balance"] = round(float(user.get("balance", 0)) - float(tx.get("amount", 0)), 2)
                else:
                    flash("Số dư không đủ để duyệt rút.", "error")
                    return redirect(url_for("admin"))
            tx["reserved"] = False
        tx["status"] = "approved"
    elif action == "reject":
        if tx.get("type") == "withdraw" and user and tx.get("reserved"):
            user["balance"] = round(float(user.get("balance", 0)) + float(tx.get("amount", 0)), 2)
            tx["reserved"] = False
        tx["status"] = "rejected"
    else:
        flash("Hành động không hợp lệ.", "error")
        return redirect(url_for("admin"))

    tx["updated_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    save_users(USERS)
    save_transactions(transactions)
    flash("Đã cập nhật giao dịch.", "success")
    return redirect(url_for("admin"))


@app.route("/admin-login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session["is_admin"] = True
            flash("Đăng nhập hậu đài thành công.", "success")
            return redirect(url_for("admin"))
        flash("Sai tài khoản hoặc mật khẩu hậu đài.", "error")
    config = load_site_config()
    return render_template("auth/admin_login.html", config=config)


@app.route("/admin-logout")
def admin_logout():
    session.pop("is_admin", None)
    flash("Đã đăng xuất hậu đài.", "success")
    return redirect(url_for("admin_login"))


if __name__ == "__main__":
    USERS = load_users()
    app.run(debug=True)
