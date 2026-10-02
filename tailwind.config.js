/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        nw: ['Nunito', 'Poppins', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      colors: {
        nw: {
          navy: '#1f3256',
          sky: '#5fa8e8',
          'sky-light': '#dcecfb',
          cream: '#f7faff',
          gold: '#f2a93b',
          'gold-deep': '#e0842a',
          text: '#2b3d63',
          muted: '#7b8ba8',
          green: '#2f9e62',
          line: '#dbe6f5',
          'line-strong': '#c5d6ec',
        },
      },
      backgroundImage: {
        'nw-grad-page': 'linear-gradient(180deg, #e6f1fc 0%, #f4f8fd 100%)',
        'nw-grad-header': 'linear-gradient(135deg, #8cc4f5 0%, #5fa8e8 60%, #4a8fd6 100%)',
        'nw-grad-gold': 'linear-gradient(180deg, #ffc15a 0%, #e0842a 100%)',
        'nw-grad-gold-tile': 'linear-gradient(180deg, #ffd27a, #e0842a)',
        'nw-grad-sky': 'linear-gradient(180deg, #7fb9ef 0%, #4a8fd6 100%)',
      },
      boxShadow: {
        'nw-card': '0 4px 14px rgba(31,50,86,.12), inset 0 0 0 1px rgba(95,168,232,.25)',
        'nw-card-hover': '0 8px 20px rgba(31,50,86,.18), inset 0 0 0 1px rgba(95,168,232,.5)',
        'nw-header': 'inset 0 -2px 0 rgba(255,255,255,.25)',
        'nw-chip': '0 1px 3px rgba(20,40,90,.25)',
        'nw-gold': '0 3px 8px rgba(224,132,42,.4), inset 0 1px 0 rgba(255,255,255,.5)',
        'nw-sky': '0 2px 6px rgba(74,143,214,.4), inset 0 1px 0 rgba(255,255,255,.45)',
      },
    },
  },
  plugins: [],
}