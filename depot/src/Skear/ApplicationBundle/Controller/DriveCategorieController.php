<?php

namespace Skear\ApplicationBundle\Controller;

use Skear\ApplicationBundle\Entity\DriveCategorie;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

/**
 * Drivecategorie controller.
 *
 */
class DriveCategorieController extends Controller
{
    /**
     * Lists all driveCategorie entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $driveCategories = $em->getRepository('SkearApplicationBundle:DriveCategorie')->findAll();

        return $this->render('drivecategorie/index.html.twig', array(
            'driveCategories' => $driveCategories,
        ));
    }

    /**
     * Creates a new driveCategorie entity.
     *
     */
    public function newAction(Request $request)
    {
        $driveCategorie = new Drivecategorie();
        $form = $this->createForm('Skear\ApplicationBundle\Form\DriveCategorieType', $driveCategorie);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($driveCategorie);
            $em->flush($driveCategorie);

            return $this->redirectToRoute('categorie_show', array('id' => $driveCategorie->getId()));
        }

        return $this->render('drivecategorie/new.html.twig', array(
            'driveCategorie' => $driveCategorie,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a driveCategorie entity.
     *
     */
    public function showAction(DriveCategorie $driveCategorie)
    {
        $deleteForm = $this->createDeleteForm($driveCategorie);

        return $this->render('drivecategorie/show.html.twig', array(
            'driveCategorie' => $driveCategorie,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing driveCategorie entity.
     *
     */
    public function editAction(Request $request, DriveCategorie $driveCategorie)
    {
        $deleteForm = $this->createDeleteForm($driveCategorie);
        $editForm = $this->createForm('Skear\ApplicationBundle\Form\DriveCategorieType', $driveCategorie);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('categorie_index');
        }

        return $this->render('drivecategorie/edit.html.twig', array(
            'driveCategorie' => $driveCategorie,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a driveCategorie entity.
     *
     */
    public function deleteAction(Request $request, DriveCategorie $driveCategorie)
    {
        $form = $this->createDeleteForm($driveCategorie);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($driveCategorie);
            $em->flush($driveCategorie);
        }

        return $this->redirectToRoute('categorie_index');
    }

    /**
     * Creates a form to delete a driveCategorie entity.
     *
     * @param DriveCategorie $driveCategorie The driveCategorie entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(DriveCategorie $driveCategorie)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('file_delete', array('id' => $driveCategorie->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
