<?php
$key = urlencode($_GET['key']);
$page = isset($_GET['page']) ? $_GET['page'] : 1;
$url = "http://www.xiami.com/app/nineteen/search/key/{$key}/page/{$page}";
$json = file_get_contents($url);
echo $json;
