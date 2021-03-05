<?php

$name = $_FILES['image']['name'];

$tmp_name = $_FILES['image']['tmp_name'];

move_uploaded_file($tmp_name, 'upload/' . $name);