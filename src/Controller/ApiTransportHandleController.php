<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

#[Route('/api/transport', name: 'app_api_transport_handle')]

class ApiTransportHandleController extends AbstractController
{
    
    #[Route('/make', name: 'handle_make')]
    public function make(Request $request):Response{
        
        if($request->isMethod('POST')){

            $transportFrom = $request->request->get('transport-from');
            $transportTo = $request->request->get('transport-to');
            $transportPlaneType = $request->request->get('plane-type');
            $transportDocs = $request->files->get('transport-docs');
            $transportDate = $request->request->get('transport-date');
            $transportLoads = $request->request->get('transport-loads');
            
            var_dump($transportFrom);
            var_dump($transportTo);
            var_dump($transportPlaneType);
            var_dump($transportDocs[0]->getMimeType());
            var_dump($transportDate);
            var_dump($transportLoads);
            //$files = $request->files->get('transport-docs');
            //var_dump($files[0]->getClientOriginalName());
            $this->makeMail(
                $transportFrom,
                $transportTo,
                $transportDocs,
                $transportDate,
                $transportLoads
            );
            return new Response(
                "<html><body>Yee I got something    </body></html>"
            );

        }
        else{
            return new Response(
                '<html><body>Didnt get it </body></html>'
            );
        }


    }

    protected function makeMail($transportFrom, $transportTo, $transportDocs, $transportDate, $transportLoads){
        
        $transport = Transport::fromDsn('smtp://tomlipdev@gmail.com:koormjddihwgwgnp@smtp.gmail.com:587');
        
        $mailer = new Mailer($transport);
        $email = (new Email());
        $email->from('tomlipdev@gmail.com');
        $email->to('tomik993@o2.pl');

        $email->subject("Nowy transport");
        
        if($transportDocs != NULL){
            foreach($transportDocs as $file){
                $email->attachFromPath($file, $file->getClientOriginalName(), $file->getMimeType());
            }
        }

        $loads = '';
        foreach($transportLoads as $load){
            $loads = $loads.'<tr style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px; text-align:center;">'.$load['load-name'].'</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px; text-align:center;">'.$load['load-weight'].'t</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 10px; text-align:center;">'.$load['load-type'].'</td>
            </tr>';
        }

        $email->html('<div style="width: 100%; display: flex; align-items: center; flex-direction: column;">
        <p style="font-size: 1.3rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(90deg, hsla(164, 38%, 18%, 1) 0%, hsla(158, 77%, 77%, 1) 100%); height: 50px; width: 80%;">Nowy transport!</p>
        <p style="padding-left: 20px; width: 80%;">Transport z: '."\t".$transportFrom.'</p>
        <p style="padding-left: 20px; width: 80%;">Transport do: '."\t".$transportTo.'</p>
        <p style="padding-left: 20px; width: 80%;">Data transportu: '."\t".$transportDate.'</p>
        <table style="border: 1px solid black; border-collapse: collapse; padding: 10px; width:80%">
            <tr style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
                <th style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Nazwa</th>
                <th style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Waga</th>
                <th style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Rodzaj</th>
            </tr>
            '.$loads.'
        </table>
        <p style="font-size: 0.9rem; display: flex;	align-items: center; justify-content: center;
        background: linear-gradient(90deg, hsla(164, 38%, 18%, 1) 0%, hsla(158, 77%, 77%, 1) 100%);
        height: 50px; width: 80%;">Tomasz Lipowiec</p>
    </div>
');

        $mailer->send($email);
        
    }
}
