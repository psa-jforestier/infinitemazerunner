<?php
define('DATA_FOLDER', dirname(__FILE__).'/data');
define('MAX_GAME_AGE_SECONDS', 3600); // 1 hour

/** removing this to have the fastest code possible
if (!is_dir(DATA_FOLDER)) {
    mkdir(DATA_FOLDER, 0755, true);
}
*/