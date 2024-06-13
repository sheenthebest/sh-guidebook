fx_version 'adamant'
game 'gta5'
lua54 'yes'

author 'sheen'
description 'Guidebook'
version '1.0'

shared_scripts {
    'config.lua',
}

client_scripts {
    'client.lua',
}

ui_page 'html/index.html'
files { 
    'html/imgs/**.png',
    'html/index.html', 
    'html/config.js',
    'html/script.js',
    'html/styles.css'
}

escrow_ignore {
    '**.lua',
}
