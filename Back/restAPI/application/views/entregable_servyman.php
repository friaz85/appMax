<?php
setlocale(LC_TIME, "es_ES");
$objDateTime = new DateTime('NOW');
$string = $citas[0]['fechaCita'];
$date = DateTime::createFromFormat("d/m/Y", $string);

?>
<!DOCTYPE html>
<html>

<head>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta charset="utf-8">
    <title>Pdf</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">

    <style>
         @page {
            margin: 1cm 1cm 0cm 1cm;
        }

        /*
        body {
            margin-top: 4cm;
            margin-left: 2cm;
            margin-right: 2cm;
            margin-bottom: 4cm;
        } */

        body {
            
            font-family: Helvetica, Arial, sans-serif;
            font-size: 12px;
            line-height: 1.42857143;
            color: #333;
            background-color: #fff;
        }

        .td-25 {
            width: 25%;
        }

        .td-50 {
            width: 50%;
        }

        .td-100 {
            width: 100%;
        }

        .rounded {
            border-radius: 8px;
        }

        .rounded-top {
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
        }

        .border-bottom {
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            border-left: 1px solid #000;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
        }

        .text-red {
            color: crimson;
            font-size: 14px;
        }

        .bgTitulo {
            background-color: #f0f0f0;
            color: #000;
            font-weight: bold;
        }

        .fs-15 {
            font-size: 15px;
        }

        .bordered {
            border: 1px solid #000;
            padding: 3px;
        }

        .imgEvidencia {
            max-width: 200px;
            max-height: 150px;
            width: 150px;
        }

        .fs-25 {
            font-size: 25px;
        }

        .mt-2 {
            margin-top: 20px;
        }

        .bgEncabezado {
            background-color: #160A5E;
            border-color: #160A5E;
        }

        .text-white {
            color: #fff !important;
        }

        footer {
            position: fixed; 
            bottom: 0cm; 
            left: 0cm; 
            right: 0cm;
            height: 2cm;

            /** Extra personal styles **/
            background-color: #160A5E;
            color: white;
            text-align: center;
            line-height: 1.5cm;
        }
    </style>
</head>

<body>
    <main>
        <div class="container">
            <div class="row">
                <div class="col-xs-2 text-left">
                    <img src="<?php echo $citas[0]['Logo'] ?>" alt="" border="0" width="110" height="38">
                </div>
                <div class="col-xs-7 text-center fs-25"><?php echo $citas[0]['ClientePadre'] ?></div>
                <div class="col-xs-2 text-center">
                    <div class="bgEncabezado text-white rounded-top">Folio</div>
                    <div class="border-bottom text-red "><?php echo $citas[0]['idCita'] ?></div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-xs-2 bgTitulo  bordered">Cliente: </div>
                <div class="col-xs-10 bordered"><?php echo ($citas[0]['RazonSocial']) ?></div>
            </div>
            <div class="row">
                <div class="col-xs-2 bgTitulo  bordered">Dirección: </div>
                <div class="col-xs-10 bordered"><?php echo ($citas[0]['Direccion']) ?></div>
            </div>
            <div class="row">
                <div class="col-xs-2 bgTitulo  bordered">Mes: </div>
                <div class="col-xs-4 bordered"><?php echo strftime("%B", strtotime($citas[0]['fechaCita'])); ?></div>
                <div class="col-xs-1 bgTitulo  bordered">Ruta: </div>
                <div class="col-xs-4 bordered"><?php echo ($citas[0]['Ruta']) ?></div>
            </div>
            <div class="row">
                <div class="col-xs-12 text-center justify-content-center">
                    <p class="text-center text-white bgEncabezado rounded mt-2 fs-25">Reporte de actividades</p>
                </div>
            </div>
            <table class="table table-striped table-hover table-bordered">
                <thead>
                    <tr>
                        <th>Tarea</th>
                        <th>Actividad</th>
                        <th>Evidencia fotográfica de inicio</th>
                        <th>Evidencia fotográfica de fin</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($tareas as $key => $val) { ?>
                        <tr>
                            <td><?php echo ($val['Tarea']); ?></td>
                            <td><?php echo ($val['Actividad']); ?></td>
                            <td class="text-center"><img src="<?php echo ($val['fotoInicio']); ?>" class="imgEvidencia"></img></td>
                            <td class="text-center"><img src="<?php echo ($val['fotoFin']); ?>" class="imgEvidencia"></img></td>
                        </tr>

                    <?php } ?>
                <tbody>
            </table>
            <?php if ($citas[0]['ComentariosFinales']) { ?>
                <div class="row mt-2">
                    <div class="col-xs-2 bgTitulo  bordered">Observaciones: </div>
                    <div class="col-xs-10 bordered"><?php echo ($citas[0]['ComentariosFinales']) ?></div>
                </div>
            <?php } ?>
            <div class="row mt-2">
                <div class="col-xs-2 bgTitulo  bordered">Tiempo utilizado: </div>
                <div class="col-xs-2 bordered"> <b>Traslado</b> <?php echo ($citas[0]['tiempoTraslado']) ?></div>
                <div class="col-xs-3 bordered"> <b>Inicio: </b> <?php echo ($citas[0]['fechaComienzo']) ?></div>
                <div class="col-xs-3 bordered"> <b>Término: </b> <?php echo ($citas[0]['fechaFin']) ?></div>
            </div>
            <div class="row mt-2">
                <div class="col-xs-6 bgTitulo  bordered">¿El equipo quedó funcionando normalmente? </div>
                <div class="col-xs-2 bordered"><?php echo ($citas[0]['EquipoFuncionando']) ?></div>
            </div>
            <div class="row mt-2">
                <h5>Recibí de conformidad:</h5>
                <div class="col-xs-2 bgTitulo  bordered">Nombre:</div>
                <div class="col-xs-6 bordered"><?php echo ($citas[0]['nombreConformidad']) ?></div>
            </div>
            <div class="row">
                <div class="col-xs-2 bgTitulo  bordered">Puesto:</div>
                <div class="col-xs-6 bordered"><?php echo ($citas[0]['puestoConformidad']) ?></div>
            </div>
            <div class="row">
                <div class="col-xs-2 bgTitulo  bordered">Firma</div>
                <div class="col-xs-2 bordered"><img src="<?php echo $citas[0]['Firma'] ?>" alt="" border="0" width="110" height="60">
            </div>



        </div>
    </main>
    <footer>
        <div class="row">
            <div class="col-xs-12 text-center">
                <p>Copyright &copy; <?php echo date("Y"); ?></p>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12 text-right">
                <small>Fecha y hora de generación: <?php echo $objDateTime->format('d-m-Y H:i'); ?></small>
            </div>
        </div>
    </footer>
</body>

</html>