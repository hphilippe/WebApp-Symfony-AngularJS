<?php

namespace Skear\ApplicationBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('SkearApplicationBundle:Default:index.html.twig');
    }
}
