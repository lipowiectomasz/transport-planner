<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TransportFormController extends AbstractController
{
    //#[Route('/transport/form', name: 'app_transport_form')]
    #[Route('/', name: 'app_transport_form')]
    public function index(): Response
    {
        return $this->render('transport_form/index.html.twig', [
            'controller_name' => 'TransportFormController',
        ]);
    }
}
