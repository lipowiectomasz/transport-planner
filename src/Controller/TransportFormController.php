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

    #[Route('/notsend', name: 'app_transport_notsend')]
    public function notsend(): Response
    {
        return $this->render('transport_form/formNotSended.html.twig');
    }

    #[Route('/send/{mail}', name: 'app_transport_send')]
    public function send(string $mail): Response
    {
        return $this->render('transport_form/formSended.html.twig', ['mail' => $mail]);
    }
}
