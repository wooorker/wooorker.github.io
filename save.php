<?php
	
	//接受参数
	$data = $_POST;

	//检查参数是否正确
	if(empty($_POST['_key']) || $_POST['_key'] !== md5('floowcharts')){
		echo json_encode([
			'status' => 0, 
			'info'   => 'Arguments error'
		]);

		die();
	}

	if(!isset($_POST['email']) || empty($_POST['email'])){
		echo json_encode([
			'status' => 0,
			'info'   => 'The email is required'
		]);

		die();
	}

	$email = $_POST['email'];
	$emailReg = '/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/';

	$result = preg_match($emailReg, $email);

	if($result == false){
		echo json_encode([
			'status' => 0,
			'info'   => 'Please enter a valid email address.'
		]);

		die();
	}

	if(!isset($_POST['feedback']) || empty($_POST['feedback'])){
		echo json_encode([
			'status' => 0,
			'info'   => 'The feedback is required'
		]);

		die();
	}

	$feedback = $_POST['feedback'];

	//检查是否有文件，保存内容到文件
	$file_path = __DIR__ . '/log/';
	if(!is_dir($file_path)){
		$res = mkdir($file_path);
		if($res === false){
			echo json_encode([
				'status' => 0,
				'info'   => 'Failed to create directory'
			]);

			die();
		}
	}

	//写入 文件
	$filename = $file_path . 'feedback.txt';
	$data = [
		'[' . date('Y-m-d H:i:s') . ']',
		'email:' . $email,
		'feedback:' . $feedback 
	];
	$save_result = file_put_contents($filename, '###' . join(' ', $data) . PHP_EOL, FILE_APPEND);
	if($save_result){
		echo json_encode([
			'status' => 1,
			'info'   => 'Save successfully'
		]);
		die();
	}else{
		echo json_encode([
			'status' => 0,
			'info'   => 'Save failed'
		]);
		die();
	}