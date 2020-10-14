<?php

$fileStr = file_get_contents(__DIR__ . '/interfaceDoc.md');
preg_match_all('/\#\#\#\#\s\d+、\s*(.*)\s*请求地址：(.*)\s*请求方式：(.*)\s/i', $fileStr, $match);
list($mt, $apiName, $apiUrl, $apiMethod) = $match;

function fileTer($str)
{
    $str = trim($str);
    $encode = mb_detect_encoding($str, array("ASCII", 'UTF-8', "GB2312", "GBK", 'BIG5'));
    $str_encode = mb_convert_encoding($str, 'UTF-8', $encode);
    return $str_encode;
}

$api = [];
foreach ($mt as $k => $v) {
    $name = fileTer($apiName[$k]);
    $url = fileTer($apiUrl[$k]);
    $method = fileTer($apiMethod[$k]);
    echo join('--', [$name, $url, $method]) . PHP_EOL;

    $key = join(array_map(function ($w) {
        return ucfirst($w);
    }, array_filter(explode('/', $url), function ($item) {
        return !empty($item);
    })));

    $api[lcfirst($key)] = [
        'title' => $name,
        'route' => $url,
        'method' => $method
    ];
}


$file = __DIR__ . '/BigNews/common/data/api.json';
file_put_contents($file, json_encode($api));

echo 'COMPLETE !!!!';
