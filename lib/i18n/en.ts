export const en = {
  lang: {
    en: "EN",
    km: "ខ្មែរ",
    switchLabel: "Switch language",
  },
  nav: {
    home: "Home",
    causes: "Causes",
    pricing: "Pricing",
    donors: "Donors",
    cheerWall: "Cheer Wall",
    posts: "Posts",
    login: "Login",
    donate: "Make a Donation",
  },
  hero: {
    eyebrow: "Get started today",
    title: "Help The Children When They Need.",
    description:
      "The world calls for acts from us, simplicity of life, the spirit of prayer, charity towards all, especially towards the lowly and the poor.",
    donateNow: "Donate now",
    learnMore: "Learn more →",
    prevSlide: "Previous slide",
    nextSlide: "Next slide",
    showSlide: "Show slide",
  },
  causes: {
    eyebrow: "Good causes",
    title: "Help The Poor Throughout Us",
    description: "Every contribution is tracked and shared with members after verification.",
    cards: [
      {
        title: "Transparent giving",
        body: "Admins record donations with payment details and proof so members always know what was received.",
      },
      {
        title: "Member accounts",
        body: "Create an account and jump into your dashboard anytime to view your history and profile.",
      },
      {
        title: "Lasting impact",
        body: "Monthly summaries and receipts help your community see progress over time.",
      },
    ],
    readMore: "Read more",
  },
  pricing: {
    eyebrow: "Donation rewards",
    title: "Give $5 or more and take advantage of our gifts",
    description:
      "Thank-you gifts and apparel start at $5. Pick a level below—or give any amount from $5 up and receive the reward for the tier you reach.",
    minimum: "Rewards from $5 up",
    giftLabel: "You receive",
    popular: "Most popular",
    donateCta: "Donate ${amount}",
    note: "Donations under $5 are welcome but do not include a physical gift. Gifts and apparel are prepared after admin verification. Sizes and colors may vary while supplies last.",
    tiers: [
      {
        badge: "Gift",
        gift: "WMAD sticker pack",
        description: "Three vinyl stickers with our logo and a message of hope for the kids we support.",
      },
      {
        badge: "Gift",
        gift: "WMAD enamel pin",
        description: "A collectible WMAD pin you can wear on a bag, jacket, or lanyard to show your support.",
      },
      {
        badge: "Gift",
        gift: "Wristband + stickers",
        description: "Silicone WMAD wristband paired with our sticker pack—wear your support every day.",
      },
      {
        badge: "T-Shirt",
        gift: "WMAD charity T-shirt",
        description: "Soft cotton tee with the WMAD DONATE logo. Available in standard unisex sizes.",
      },
      {
        badge: "T-Shirt",
        gift: "Premium hoodie",
        description: "Heavier-weight hoodie with embroidered WMAD mark—our thank-you for stepping up at $50.",
      },
      {
        badge: "Gift box",
        gift: "Full supporter bundle",
        description: "T-shirt, hoodie, wristband, stickers, and a handwritten thank-you card in a gift box.",
      },
    ],
  },
  donors: {
    eyebrow: "Our donors",
    title: "Members who stepped up",
    description:
      "Approved members with at least one recorded donation. Thank you for making a difference.",
    empty: "No public donor profiles yet. Be the first —",
    registerLink: "register as a donor",
  },
  cheerWall: {
    eyebrow: "Cheer wall",
    title: "Messages of hope for the kids",
    description:
      "Our members leave a little love here—emoji, warm words, or both. It's a small thank-you to the children we support and a fun way to stay connected with the community.",
    empty:
      "No cheer notes yet. When members post from their dashboard, they'll show up here for everyone to see.",
  },
  communityPosts: {
    eyebrow: "Community feed",
    title: "Latest from our community",
    description:
      "Members and admins share updates, event photos, and news here—like a community board for WMAD donors and volunteers.",
    empty:
      "No community posts yet. Log in to your dashboard or admin console to share the first update.",
    cta: "Want to post?",
    loginLink: "Sign in",
  },
  activity: {
    eyebrow: "Our activity",
    title: "How We Support Communities",
    description:
      "We run monthly initiatives with members and volunteers, then publish transparent updates for each activity.",
    cards: [
      {
        title: "Food distribution day",
        body: "Packed and delivered essential food kits to families in need with member volunteers.",
      },
      {
        title: "School support drive",
        body: "Provided learning supplies and support funds for students to continue education.",
      },
      {
        title: "Community health outreach",
        body: "Organized a local outreach program with hygiene kits and awareness materials.",
      },
    ],
  },
  footer: {
    title: "Ready to give?",
    description: "Create your account and join our donor community.",
    register: "Register",
    login: "Member login",
  },
  auth: {
    login: {
      eyebrow: "Welcome back",
      title: "Login to your account",
      description: "Admin goes to admin portal, member goes to dashboard automatically.",
      email: "Email",
      password: "Password",
      submit: "Login",
      submitting: "Logging in…",
      newDonor: "New donor?",
      register: "Create an account",
      error: "Login failed.",
    },
    register: {
      eyebrow: "New donor",
      title: "Create your account",
      description:
        "Register as a member and you'll be signed in automatically to view and manage your donations on your dashboard.",
      name: "Full name",
      email: "Email",
      password: "Password",
      major: "Major / field of study (optional)",
      profileUrl: "Profile image URL (optional)",
      uploadLabel: "Or upload profile photo",
      uploading: "Uploading...",
      imageSaved: "Photo saved — it will be sent when you submit the form.",
      imageUploadError: "Image upload failed.",
      submit: "Register",
      submitting: "Creating account...",
      hasAccount: "Already have an account?",
      login: "Log in",
      error: "Registration failed.",
    },
  },
  warmWishes: {
    empty: "No messages yet. Members can share a few kind words from their dashboard.",
    member: "Member",
  },
} as const;
