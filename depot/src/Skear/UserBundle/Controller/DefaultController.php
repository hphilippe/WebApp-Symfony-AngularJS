<?php

namespace Skear\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('SkearUserBundle:Default:index.html.twig');
    }
}
