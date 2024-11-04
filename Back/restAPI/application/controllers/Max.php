<?php
defined('BASEPATH') or exit('No direct script access allowed');
require_once(APPPATH . '/libraries/REST_Controller.php');
require_once(APPPATH . '/libraries/dompdf/autoload.inc.php');

use Restserver\libraries\REST_Controller;

class Max extends REST_Controller
{

	public function __construct()
	{
		header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
		header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding, Access-Control-Allow-Origin");
		header("Access-Control-Allow-Origin: *");
		parent::__construct();
		$this->load->database('default');
		date_default_timezone_set('Etc/GMT+6');
	}

    public function token_get() {
        $token = bin2hex(openssl_random_pseudo_bytes(40)); 
        $token3 = hash('ripemd160', $token);
        $token2 = hash('ripemd160', '5215540297872');
        $respuesta = array(
            'error' => FALSE,
            'token' => $token,
            'token2' => $token2,
            'token3' => $token3,
        );
        $this->response($respuesta);
        return;
    }

    public function addUsuario_post()
	{
		$data = $this->post();
        $date = date('Y-m-d H:i:s');


        // Busco cuántos registros tiene el usuario
        $this->db->reset_query();
        $this->db->select("count(*) as total");
        $this->db->from('tblRegistro r');
        $this->db->join('tblUsuario u', 'r.idUsuario = u.idUsuario');
        $this->db->where('u.Celular', $data['user_number']);
        $this->db->where('r.Estatus !=', 3);
        $query    = $this->db->get();
        $registro = $query->row();


        // si tiene dos registros envio error
        if ($registro->total >= 3) {
            $respuesta = array(
                'error' => 1,
                'idUsuario' => 0,
                'token' => '',
            );
            $this->response($respuesta);
            return;
        }

		$this->db->select("u.*");
		$this->db->from('tblUsuario u');
		$this->db->where('u.Celular', $data['user_number']);
		$query = $this->db->get();
		$usuario = $query->row();

        $token = bin2hex(openssl_random_pseudo_bytes(40)); 
        $token2 = hash('ripemd160', $token);


		if (empty($usuario)) {
            $this->db->reset_query();
            
            $insertar = array(
                'Celular'       => $data['user_number'],
                'NombreWA'        => $data['user_name'],
                'Activo'        => 1,
                'FechaRegistro' => $date,
                'Token'         => $token2,
            );
            $this->db->insert('tblUsuario', $insertar);
            $idusuario = $this->db->insert_id();

            $esNuevo = true;
            $respuesta = array(
                'error' => 2,
                'token' => $token2,
                'idUsuario' => $idusuario
            );
            $this->response($respuesta);
            return;
		} else {
            $esNuevo = false;
            $idusuario = $usuario->idUsuario;
            $token = $usuario->Token;
            // Elimino los registros del usuario con estatus 0
            $this->db->reset_query();
            $this->db->delete('tblRegistro', array('Estatus' => 0, 'idUsuario' => $idusuario));

            $respuesta = array(
                'error' => 0,
                'token' => $token,
                'idUsuario' => $idusuario
            );
            $this->response($respuesta);
            return;
        }

        // $target_path = explode('public_html', getcwd())[0] . 'public_html/logKleenex5.txt';

        // // $file2 = 'logKleenex3.txt';
        // $data3 = "Entra\n" . $idusuario . "\n" . $token . "\n" . $date . "\n" . $data['user_number'] . "\n" . $data['user_name'] . "\n";
        // file_put_contents($target_path, $data3);

        // if ($esNuevo) {
        //     $respuesta = array(
        //         'error' => 2,
        //         'token' => $token2,
        //         'idUsuario' => $idusuario
        //     );
        //     $this->response($respuesta);
        //     return;
        // }

		// $respuesta = array(
		// 	'error' => 0,
		// 	'token' => $token2,
		// 	'idUsuario' => $idusuario
		// );
		// $this->response($respuesta);
		// return;
	}

    public function updateNombre_post() {

       
        $data = $this->post();
        $date = date('Y-m-d H:i:s');
        $nombre = $data['nombre'];
        $token1 = $data['token'];

       
        // Obtengo el usuario por token
        $this->db->select("u.*");
        $this->db->from('tblUsuario u');
        $this->db->where('u.Token', $token1);
        $query = $this->db->get();
        $usuario = $query->row(); 

        if ($usuario->tieneNombre == 0) {
             // Actualizo nombre
            $this->db->query("UPDATE tblUsuario SET UserName = '" . $nombre . "', tieneNombre = 1 WHERE Token = '" . $token1 . "'");
        }

        // Inserto registro en tblRegistro
        $token = bin2hex(openssl_random_pseudo_bytes(40)); 
        $token2 = hash('ripemd160', $token);
        $insertar = array(
            'idUsuario'     => $usuario->idUsuario,
            'FechaRegistro' => $date,
            'Token'         => $token2,
        );

        $this->db->insert('tblRegistro', $insertar);
        $idRegistro = $this->db->insert_id();
        
        $respuesta = array(
            'error'     => 10,
            'mensaje'   => ''
        );

        $this->response($respuesta);
        return;
    }

    public function validarCodigoEntrada_post() {
        $data = $this->post(); 
        $date = date('Y-m-d H:i:s');
        $codigo = $data['codigo_entrada'];
        $token1 = $data['token'];

        // Busco código en tblCodigoEntrada con Activo = 1
        $this->db->select("ce.*");
        $this->db->from('tblCodigoEntrada ce');
        $this->db->where('ce.CodigoEntrada', $codigo);
        $this->db->where('ce.Activo', 1);
        $query = $this->db->get();
        $codigoEntrada = $query->row();

        if (empty($codigoEntrada)) {
            $respuesta = array(
                'error' => 1,
                'mensaje' => 'Código de entrada no válido'
            );
            $this->response($respuesta);
            return;
        } else {
            // Actualizo tblCodigoEntrada con Activo = 0 y FechaAsignado = $date
            $this->db->query("UPDATE tblCodigoEntrada SET Activo = 0, FechaAsignado = '" . $date . "' WHERE CodigoEntrada = '" . $codigo . "'");
       
            // Obtengo el usuario por token
            $this->db->select("u.*");
            $this->db->from('tblUsuario u');
            $this->db->where('u.Token', $token1);
            $query = $this->db->get();
            $usuario = $query->row(); 

            // Inserto registro en tblRegistro
            $token = bin2hex(openssl_random_pseudo_bytes(40)); 
            $token2 = hash('ripemd160', $token);
            $insertar = array(
                'idUsuario'     => $usuario->idUsuario,
                'FechaRegistro' => $date,
                'Token'         => $token2,
                'idCodigoEntrada' => $codigoEntrada->idCodigoEntrada
            );

            $this->db->insert('tblRegistro', $insertar);
            $idRegistro = $this->db->insert_id();

            $respuesta = array(
                'error' => 0,
                'mensaje' => 'Código de entrada válido'
            );
            $this->response($respuesta);
            return;
        }


    }
}
